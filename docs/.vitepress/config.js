import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getItems = folder => readdirSync(resolve(__dirname, `../${folder}`))
  .filter(file => file.endsWith('.md'))
  .map(path => ({ text: path.replace(/-|.md/g, ' '), link: `/${folder}/${path.slice(0, -3)}` }))

export default {
  title: 'J2U',
  description: 'J2U, Another JSON schema Form Generator',
  themeConfig: {

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Morgbn/j2u' },
      { icon: 'twitter', link: 'https://twitter.com/MorgbnDev' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/intro/' }
        ]
      },
      {
        text: 'Examples',
        items: getItems('examples')
      }
    ],

    editLink: {
      pattern: 'https://github.com/morgbn/j2u/edit/main/docs/:path'
    },

    footer: {
      message: 'Released under the <a href="https://github.com/morgbn/j2u/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2023-present <a href="https://github.com/morgbn">Morgbn</a>'
    }
  }
}
