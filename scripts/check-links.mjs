#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';

const ROOT = resolve(process.cwd(), 'docs');
const mdFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name.endsWith('.md')) mdFiles.push(p);
  }
}

walk(ROOT);

const rel = (p) => p.replace(process.cwd() + '/', '');
let bad = 0;

for (const file of mdFiles) {
  const text = readFileSync(file, 'utf8');
  // Match markdown links: [label](target)
  const links = [...text.matchAll(/\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(m => m[1]);
  for (const href of links) {
    // Only check relative docs links; skip http(s), mailto, anchors, images and absolute /docs base links
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    if (/\.(png|jpg|jpeg|gif|svg|webp|avif)$/.test(href)) continue;
    let target = href;
    if (href.startsWith('/')) {
      // Map site-absolute to docs root
      target = join(ROOT, href.replace(/^\//, ''));
    } else {
      target = join(dirname(file), href);
    }
    // Allow omitting .md in links
    const candidates = [target, target + '.md'];
    const ok = candidates.some(p => {
      try { return statSync(p).isFile(); } catch { return false; }
    });
    if (!ok) {
      console.error(`Broken link in ${rel(file)} -> ${href}`);
      bad++;
    }
  }
}

if (bad) {
  console.error(`\nFound ${bad} broken link(s).`);
  process.exit(1);
} else {
  console.log(`Checked ${mdFiles.length} Markdown files. No broken relative links.`);
}

