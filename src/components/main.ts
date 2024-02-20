import type { App } from 'vue'
import { JsonSchema, JsonList, JsonSchemaWithoutAjv } from '@/components'

export default {
  install: (app: App) => {
    app.component('JsonSchema', JsonSchema)
    app.component('JsonSchemaWithoutAjv', JsonSchemaWithoutAjv)
    app.component('JsonList', JsonList)
  }
}

export { JsonSchema, JsonSchemaWithoutAjv, JsonList }
