// Local preview of the static export: `pnpm build` then `pnpm preview`.
// next.config.ts sets `output: 'export'`, so `next start` refuses to run; serve out/ instead.
// Mirrors the export host's routing: `/` -> index.html, extension-less paths -> `<path>.html`.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const DIR = path.resolve('out')
const MIME = { '.css':'text/css','.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4' }
createServer(async (req, res) => {
  let f = decodeURIComponent(req.url.split('?')[0].split('#')[0])
  if (f.endsWith('/')) f += 'index.html'
  if (!path.extname(f)) f += '.html'
  const file = path.resolve(DIR, '.' + f)
  if (!file.startsWith(DIR)) return res.writeHead(403).end('forbidden')
  let body
  try {
    body = await readFile(file)
  } catch {
    res.writeHead(404).end('not found')
    return
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' }).end(body)
}).listen(4173, '127.0.0.1', () => console.log('preview: http://localhost:4173'))
