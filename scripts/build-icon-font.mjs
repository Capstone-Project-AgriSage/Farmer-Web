// Builds src/assets/fonts/material-symbols-subset.woff2: Material Symbols Outlined cut down to the icons the app uses.
//
// The full variable font is about 1.1 MB. Run `npm run icons` after adding an icon; an icon that is missing from the subset
// shows its name as plain text.
//
// How icons are found (Google ignores names that are not icons, so a few extra words cost nothing):
//   1. the text of an element with the material-symbols-outlined class:   <span className="material-symbols-outlined">home</span>
//   2. a string given to an icon property:                                 icon: 'storefront'   iconName="home"
//   3. any snake_case string literal ('local_shipping'): almost always an icon in this code base
// A single-word icon that reaches the page some other way (a ternary, an array of strings) is missed: add it to EXTRA.
const EXTRA = ['payments', 'psychology'] // Single-word names returned by notificationIcon().

import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'src')
const outFile = join(srcDir, 'assets', 'fonts', 'material-symbols-subset.woff2')

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) yield* walk(full)
    else if (/\.(tsx|ts)$/.test(name)) yield full
  }
}

const names = new Set(EXTRA)
for (const file of walk(srcDir)) {
  const text = readFileSync(file, 'utf8')
  // 1. <span className="material-symbols-outlined ...">home</span>
  for (const m of text.matchAll(/material-symbols-outlined[^>]*>\s*([a-z][a-z0-9_]*)\s*</g)) names.add(m[1])
  // 2. icon: 'storefront'   iconName="home"   icon={'home'}
  for (const m of text.matchAll(/\bicon\w*\s*[:=]\s*\{?\s*['"`]([a-z][a-z0-9_]*)['"`]/gi)) names.add(m[1])
  // 4. in a file that draws icons, any single lowercase word in quotes: ternaries like open ? 'visibility_off' : 'visibility'
  if (text.includes('material-symbols-outlined')) for (const m of text.matchAll(/['"`]([a-z][a-z0-9]{2,24})['"`]/g)) names.add(m[1])
  // 3. 'local_shipping' anywhere
  for (const m of text.matchAll(/['"`]([a-z][a-z0-9]*_[a-z0-9_]*)['"`]/g)) names.add(m[1])
}
const list = [...names].sort()

const cssUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=${list.join(',')}`
if (cssUrl.length > 7500) throw new Error(`Icon list too long for one request (${cssUrl.length} chars): ${list.length} candidates`)

// A browser user agent makes Google answer with woff2.
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
const css = await (await fetch(cssUrl, { headers: { 'User-Agent': ua } })).text()
const fontUrl = css.match(/url\((https:[^)]+)\)/)?.[1]
if (!fontUrl) throw new Error('No font url in the Google Fonts response:\n' + css.slice(0, 300))

const bytes = Buffer.from(await (await fetch(fontUrl)).arrayBuffer())
mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, bytes)
console.log(`${list.length} candidate names -> ${outFile} (${(bytes.length / 1024).toFixed(1)} KB)`)
