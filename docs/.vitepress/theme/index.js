import DefaultTheme from 'vitepress/theme'

const modules = import.meta.glob('../../examples/*.vue', { eager: true })
const components = []

for (const path in modules) {
  components.push(modules[path].default)
}


export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    components.forEach(component => {
      app.component(component.__file.replace(/.*\/(\w+).vue$/gm, '$1Example'), component)
    })
  }
}