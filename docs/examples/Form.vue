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
    e: {
      type: 'string',
      title: 'User Type',
      enum: ['User', 'Editor', 'Admin']
    },
    obj: {
      type: 'object',
      title: 'Object',
      properties: {
        obj_a: { type: 'string' },
        obj_b: {
          type: 'string',
          title: 'User Food',
          enum: ['🫓', '🍕', '🍔', '🥗']
        }
      }
    }
  }
}
const uiSchema = {
  properties: {
    obj: {
      properties: {
        obj_b: {
          uiType: 'radio'
        }
      }
    }
  }
}
</script>
