import type { App } from 'vue'
import { JsonSchema, JsonList } from '@/components'

export default {
  install: (app: App) => {
    app.component('JsonSchema', JsonSchema)
    app.component('JsonList', JsonList)
  }
}

export { JsonSchema, JsonList }
