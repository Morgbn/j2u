import type { App } from 'vue'
import { JsonSchema } from '@/components'

export default {
  install: (app: App) => {
    app.component('JsonSchema', JsonSchema)
  }
}

export { JsonSchema }
