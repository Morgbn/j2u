<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
    <pre>data = {{ data }}</pre>
    <div>
      <JsonSchema
        ref="form"
        v-model="data"
        :schema="schema"
        :ui-schema="uiSchema"
        :components="customComponents"
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
import { ref, defineAsyncComponent } from 'vue'
import JsonSchema from '@/components/JsonSchema.vue'

const form = ref(null)
const data = ref({ b: 18 })
const schema = {
  type: 'object',
  properties: {
    a: {
      type: 'string',
      title: 'Name',
      minLength: 2
    },
    b: {
      type: 'integer',
      title: 'Age',
      minimum: 13,
      maximum: 113
    }
  },
  required: ['b']
}
const uiSchema = {
  properties: {
    a: { order: 1 },
    dividerAB: {
      title: '',
      uiType: 'divider',
      order: 2
    },
    b: { order: 3 },
    topAlert: {
      title: '',
      uiType: 'alert',
      text: form => `Age = ${form.b ?? '??'}!`,
      color: form => form.b > 21 ? '#81c784' : (form.b < 18 ? '#f6655a' : '#ffd351')
    },
    dividerEnd: {
      title: '',
      uiType: 'divider'
    }
  }
}
const customComponents = {
  alert: {
    component: defineAsyncComponent(() => import('./CustomAlert.vue')),
    props: (_, schema) => ({
      text: schema.text,
      color: schema.color
    })
  },
  divider: {
    component: defineAsyncComponent(() => import('./CustomDivider.vue'))
  }
}
</script>

<style scoped>
input {
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>
