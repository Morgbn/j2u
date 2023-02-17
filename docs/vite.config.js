import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  plugins: [],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    }
  }
}
