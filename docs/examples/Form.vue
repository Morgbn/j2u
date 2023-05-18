<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
    <pre>data = {{ data }}</pre>
    <div>
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
import fr from 'ajv-i18n/localize/fr'
import JsonSchema from '@/components/JsonSchema.vue'
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
      type: 'integer',
      title: 'Age',
      minimum: 13,
      maximum: 113
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
    f: {
      type: 'string',
      readOnly: true,
      title: 'ReadOnly attr'
    },
    address: {
      type: 'array',
      title: 'Tuple',
      items: [
        { type: 'number', title: 'Address number' },
        { type: 'string', title: 'Name of the street' },
        { enum: ['Street', 'Avenue', 'Boulevard'], title: 'Type of street' },
        { enum: ['NW', 'NE', 'SW', 'SE'], title: 'City quadrant' }
      ]
    },
    arr: {
      type: 'array',
      title: 'Array',
      maxItems: 4,
      items: {
        type: 'object',
        title: 'Object',
        properties: {
          obj_a: {
            type: 'string',
            default: 'default value'
          },
          obj_b: {
            title: 'User Food',
            $ref: 'defs#/definitions/food'
          }
        },
        required: ['obj_b']
      }
    },
    at: {
      type: 'string',
      format: 'date',
      title: 'At'
    }
  },
  required: ['b']
}
const uiSchema = {
  properties: {
    c: {
      cond: (form, _path) => form?.b >= 18
    },
    arr: {
      items: {
        properties: {
          obj_a: {
            cond: form => !!form.c
          },
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
  },
  date: {
    component: defineAsyncComponent(() => import('./CustomDate.vue'))
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
    component: defineAsyncComponent(() => import('./CustomArray.vue'))
  }
}
</script>
