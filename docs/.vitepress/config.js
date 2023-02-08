import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const guides = readdirSync(resolve(__dirname, '../guide'))

const items = []
for (const guide of guides) {
  if (!guide.endsWith('.md')) { continue }
  const text = guide.slice(0, -3)
  items.push({ text, link: `/guide/${text}` })
}

export default {
  title: 'Vue3-JSONSchema-Form',
  description: 'Form generator based on JSON Schema',
  themeConfig: {
    sidebar: [
      {
        text: 'Introduction',
        link: '/'
      },
      {
        text: 'Components',
        items
      },
    ]
  }
}