<template>
  <div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
      <pre>{{ data }}</pre>
      <JsonSchema
        ref="form"
        v-model="data"
        :schema="schema"
        :ui-schema="uiSchema"
        :defs-schema="defsSchema"
        :components="customComponents"
        :wrappers="customWrappers"
        :i18n="fr"
      />
    </div>
    <div style="display: flex; gap: 15px">
      <button @click="data = {}">
        ♻️ RESET
      </button>
      <button @click="form.validate">
        🟩 VALIDATE
      </button>
    </div>
  </div>
</template>

<script setup>
import fr from 'ajv-i18n/localize/fr'
fr.required = 'champ requis'

const form = ref(null)
const data = ref({})
const schema = {
  type: 'object',
  properties: {
    a: {
      type: 'string',
      title: 'Name',
      minLength: 2
    },
    b: {
      type: 'number',
      title: 'Age',
      maximum: 99,
      multipleOf: 5,
      not: {
        enum: [15, 20]
      }
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
            title: 'User Food',
            $ref: 'defs#/definitions/food'
          }
        },
        required: ['obj_b']
      }
    }
  },
  required: ['b']
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
const defsSchema = {
  $id: 'defs',
  definitions: {
    food: {
      type: 'string',
      enum: ['🫓', '🍕', '🍔', '🥗']
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
