<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
    <pre>data = {{ data }}</pre>
    <div>
      <JsonSchema
        ref="form"
        v-model="data"
        :schema="schema"
        :ui-schema="uiSchema"
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
const tStrMin2 = { type: 'string', minLength: 2 }
const schema = {
  type: 'object',
  properties: {
    email: tStrMin2,
    fistName: tStrMin2,
    lastName: tStrMin2,
    nickname: tStrMin2,
    address: {
      type: 'array',
      title: 'Address',
      items: [
        { type: 'number', title: 'Address number' },
        { type: 'string', title: 'Name of the street' },
        { enum: ['Street', 'Avenue', 'Boulevard'], title: 'Type of street' },
        { enum: ['NW', 'NE', 'SW', 'SE'], title: 'City quadrant' }
      ],
      minItems: 4,
      maxItems: 6,
      additionalItems: tStrMin2
    }
  },
  required: ['email']
}
const uiSchema = {
  properties: {
    fistName: { order: 0 },
    lastName: { order: 1 },
    address: {
      items: [{}, null, { order: 0 }]
    }
  }
}
</script>
