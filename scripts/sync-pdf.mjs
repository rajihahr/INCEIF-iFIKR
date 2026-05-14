import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(
  root,
  'docs',
  'ESTABLISHING ZAKAT ON OIL AND GAS.pdf',
)
const dest = join(root, 'public', 'paper.pdf')

if (!existsSync(src)) {
  console.warn(
    'sync-pdf: source PDF missing; skipping copy. Add docs/ESTABLISHING ZAKAT ON OIL AND GAS.pdf for the full demo, or keep public/paper.pdf locally.',
  )
  process.exit(0)
}

mkdirSync(dirname(dest), { recursive: true })
copyFileSync(src, dest)
console.log('sync-pdf: copied to public/paper.pdf')
