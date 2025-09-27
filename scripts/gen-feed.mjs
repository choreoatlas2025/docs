#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const docsDir = path.join(root, 'docs')
const baseUrl = 'https://choreoatlas.io/docs/'

function walk(dir) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      out.push(...walk(p))
    } else if (name.endsWith('.md')) {
      out.push(p)
    }
  }
  return out
}

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const body = m[1]
  const meta = {}
  for (const line of body.split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (mm) meta[mm[1]] = mm[2]
  }
  return meta
}

function toUrl(rel) {
  // rel like docs/guide/getting-started.md
  let p = rel.replace(/\\/g, '/')
  p = p.replace(/^docs\//, '')
  p = p.replace(/(^|\/)index\.md$/, '$1')
  p = p.replace(/\.md$/, '/')
  return baseUrl + p
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function generate() {
  const files = walk(docsDir)
  const items = files.map(f => {
    const rel = path.relative(root, f)
    const src = fs.readFileSync(f, 'utf-8')
    const fm = parseFrontmatter(src)
    const title = fm.title || (src.match(/^#\s+(.+)/m)?.[1] ?? path.basename(f, '.md'))
    const link = toUrl(rel)
    const pub = new Date(fs.statSync(f).mtime).toUTCString()
    return `    <item>\n      <title>${escapeXml(title)}</title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${pub}</pubDate>\n    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>ChoreoAtlas Docs</title>\n    <link>${baseUrl}</link>\n    <description>ChoreoAtlas CLI documentation updates and guides.</description>\n    <language>en-us</language>\n${items}\n  </channel>\n</rss>\n`

  const out = path.join(docsDir, 'public', 'feed.xml')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, xml, 'utf-8')
  console.log('Generated docs/public/feed.xml with', files.length, 'items')
}

generate()

