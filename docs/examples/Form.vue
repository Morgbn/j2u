<template>
  <button @click="data = {}">
    Reset
  </button>
  <pre>{{ data }}</pre>
  <JsonSchema v-model="data" :schema="schema" :ui-schema="uiSchema" :components="customComponents" :wrappers="customWrappers" />
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
    arr: {
      type: 'array',
      title: 'Array',
      items: {
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
}
const uiSchema = {
  properties: {
    arr: {
      items: {
        properties: {
          obj_b: {
            uiType: 'radio'
          }
        }
      }
    }
  }
}
const customComponents = {
  boolean: {
    component: defineAsyncComponent(() => import('./CustomCheckbox.vue'))
  }
}
const customWrappers = {
  item: {
    component: defineAsyncComponent(() => import('./CustomWrapper.vue')),
    props: (propName, schema, uiSchema) => ({
      title: schema.title || schema.title === '' ? schema.title : propName,
      disabled: uiSchema?.disabled
    })
  },
  array: {
    component: defineAsyncComponent(() => import('./CustomArray.vue')),
    props: (propName, schema, uiSchema, wrapper) => {
      return { schema, uiSchema, wrapper }
    }
  }
}
</script>
