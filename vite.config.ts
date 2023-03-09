import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import typescript2 from 'rollup-plugin-typescript2'
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
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'src/components/main.ts'),
      name: 'JSONSchemaForm',
      fileName: format => `j2u.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      input: {
        main: resolve(__dirname, 'src/components/main.ts')
      },
      output: {
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'main.css' ? 'j2u.css' : assetInfo.name
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
