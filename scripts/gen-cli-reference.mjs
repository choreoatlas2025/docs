#!/usr/bin/env node
/**
 * Generate CLI reference Markdown from a JSON help schema or raw --help.
 *
 * Usage:
 *   CHOREO_CLI_JSON=path/to/help.json node scripts/gen-cli-reference.mjs
 *   CHOREO_CLI_BIN=/path/to/choreoatlas node scripts/gen-cli-reference.mjs
 *
 * Output file: docs/api/cli-commands.md
 */
import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const OUT = resolve('docs/api/cli-commands.md');

function tryLoadJson() {
  const p = process.env.CHOREO_CLI_JSON;
  if (!p) return null;
  const data = JSON.parse(readFileSync(p, 'utf8'));
  return data;
}

function tryRunBinary() {
  const bin = process.env.CHOREO_CLI_BIN;
  if (!bin) return null;
  try {
    // Prefer a structured json help if supported
    const out = execFileSync(bin, ['--help', '--format=json'], { encoding: 'utf8' });
    return JSON.parse(out);
  } catch {
    try {
      const out = execFileSync(bin, ['--help'], { encoding: 'utf8' });
      return parseTextHelp(out);
    } catch (e) {
      console.error('Failed to run CLI for help:', e.message);
      return null;
    }
  }
}

function parseTextHelp(text) {
  // Minimal parser as fallback; expects sections like `Commands:` and `Options:`.
  const lines = text.split(/\r?\n/);
  const cmds = [];
  let inCmd = false;
  for (const l of lines) {
    if (/^\s*Commands?:/i.test(l)) { inCmd = true; continue; }
    if (/^\s*Options?:/i.test(l)) { inCmd = false; }
    if (inCmd) {
      const m = l.match(/^\s*([\w:-]+)\s+(.+)$/);
      if (m) cmds.push({ name: m[1], description: m[2] });
    }
  }
  return { commands: cmds };
}

function renderMarkdown(model) {
  const header = `# CLI Commands Reference\n\n::: warning Beta Version\nChoreoAtlas CLI is currently in **Beta** status. Commands and options may change as we refine the interface.\n:::\n\n`;
  const cmds = model.commands?.length ? model.commands : [
    { name: 'discover', description: 'Generate FlowSpec and ServiceSpec from trace' },
    { name: 'validate', description: 'Validate orchestration and emit reports' },
    { name: 'lint', description: 'Structural and schema checks' },
    { name: 'ci-gate', description: 'CI wrapper for lint + validate' },
    { name: 'version', description: 'Print version metadata' }
  ];
  const body = cmds.map(c => `## \`choreoatlas ${c.name}\`\n\n${c.description}\n`).join('\n');
  return header + body;
}

const model = tryLoadJson() || tryRunBinary() || {};
const md = renderMarkdown(model);
writeFileSync(OUT, md);
console.log('Generated', OUT);

