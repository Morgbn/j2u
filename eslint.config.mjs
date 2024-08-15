import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      commaDangle: 'never',
      braceStyle: '1tbs',
      quoteProps: 'as-needed'
    }
  }
})
  .append({
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off'
    }
  })
