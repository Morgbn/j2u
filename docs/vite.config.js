import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

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
  ]
}
