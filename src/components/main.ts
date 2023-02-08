import type { App } from 'vue'
import { MyButton, MyButton2 } from '@/components'

export default {
  install: (app: App) => {
    app.component('MyButton', MyButton)
    app.component('MyButton2', MyButton2)
  }
}

export { MyButton2, MyButton }
