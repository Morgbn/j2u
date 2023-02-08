import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import typescript2 from 'rollup-plugin-typescript2'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import dts from 'vite-plugin-dts'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    }),
    typescript2({
      check: false,
      include: ['src/components/**/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          outDir: 'dist',
          sourceMap: true,
          declaration: true,
          declarationMap: true
        }
      },
      exclude: ['vite.config.ts']
    }),
    AutoImport({
      imports: ['vue'],
      include: [/\.vue$/],
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      dirs: ['src/components'],
      include: [/\.vue$/]
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: 'src/components/main.ts',
      name: 'JSONSchemaForm',
      formats: ['es', 'cjs', 'umd'],
      fileName: format => `vue3-jsonschema-form.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      input: {
        main: resolve(__dirname, 'src/components/main.ts')
      },
      output: {
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'main.css' ? 'vue3-jsonschema-form.css' : assetInfo.name
        },
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
