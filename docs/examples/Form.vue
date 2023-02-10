<template>
  <button @click="data = {}">
    Reset
  </button>
  <pre>{{ data }}</pre>
  <JsonSchema v-model="data" :schema="schema" :ui-schema="uiSchema" />
</template>

<script setup>
const data = ref({})
const schema = {
  type: 'object',
  properties: {
    a: {
      type: 'string',
      title: 'Name',
      minLength: 1
    },
    b: {
      type: 'number',
      title: 'Age',
      maximum: 99
    },
    c: {
      type: 'boolean',
      title: 'Agree'
    },
    d: {
      type: 'string',
      title: 'User Type',
      enum: [
        'User',
        'Editor',
        'Admin'
      ]
    }
  }
}
const uiSchema = {
  properties: {
    d: {
      uiType: 'radio'
    }
  }
}
</script>
