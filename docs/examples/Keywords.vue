<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
    <pre>data = {{ data }}</pre>
    <div>
      <JsonSchema
        ref="form"
        v-model="data"
        :schema="schema"
        :keywords="keywords"
        validate-trigger="change"
      />
      <div style="display: flex; gap: 15px; margin-top: 20px;">
        <button @click="form.reset">
          ♻️ RESET
        </button>
        <button @click="form.validate">
          🟩 VALIDATE
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JsonSchema from '@/components/JsonSchema.vue'

const form = ref(null)
const data = ref({})
const schema = {
  type: 'object',
  properties: {
    age: {
      type: 'integer',
      range: [18, 25],
      exclusiveRange: false
    }
  }
}

const keywords = [{
  keyword: 'range', // example from https://ajv.js.org/keywords.html#define-keyword-with-validate-function
  validate ([min, max], data, parentSchema, _dataCxt) {
    return parentSchema.exclusiveRange === true
      ? data > min && data < max
      : data >= min && data <= max
  },
  error: {
    message: ({ schema: [min, max], parentSchema }) => {
      return `Value must be between ${min} and ${max} (${parentSchema.exclusiveRange ? 'ex' : 'in'}clusive)`
    }
  },
  metaSchema: {
    // schema to validate keyword value
    type: 'array',
    items: [{ type: 'number' }, { type: 'number' }],
    minItems: 2,
    additionalItems: false
  }
}]
</script>
