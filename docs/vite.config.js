import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  plugins: [
    AutoImport({
      imports: ['vue'],
      include: [/\.vue$/]
    }),
    Components({
      dirs: ['../src/components'],
      include: [/\.vue$/]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    }
  }
}
