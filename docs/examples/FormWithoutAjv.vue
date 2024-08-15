<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
    <pre>data = {{ data }}</pre>
    <div>
      <JsonSchemaWithoutAjv
        ref="form"
        v-model="data"
        :schema="schema"
        :ui-schema="uiSchema"
        :defs-schema="defsSchema"
        :components="customComponents"
        :wrappers="customWrappers"
        :read-only="readOnly"
        :validator="validator"
      />
      <div style="display: flex; gap: 15px; margin-top: 20px;">
        <button @click="form.reset">
          ♻️ RESET
        </button>
        <button @click="form.validate">
          🟩 VALIDATE
        </button>
        <div>
          <input
            id="readOnly"
            v-model="readOnly"
            type="checkbox"
            name="readOnly"
            checked
          >
          <label for="readOnly">ALL READ-ONLY</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import JsonSchemaWithoutAjv from '@/components/JsonSchemaWithoutAjv.vue'

const readOnly = ref(false)
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
    d: {
      title: 'User Food',
      $ref: 'defs#/definitions/food'
    }
  },
  required: ['b']
}
const uiSchema = {
  properties: {
    c: { cond: (form, _path) => form?.b >= 18 },
    d: { uiType: 'radio' }
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
    component: defineAsyncComponent(() => import('./CustomArray.vue')),
    props: (_, __, uiSchema) => ({ ...uiSchema })
  }
}
const validator = (data) => {
  if (!data.b) {
    validator.errors = [{ instancePath: '/b', message: 'B est requis' }]
    return
  }
  const { minimum, maximum } = schema.properties.b
  if (data.b < minimum || data.b > maximum) {
    validator.errors = [{ instancePath: '/b', message: `B n'est pas compris entre ${minimum} et ${maximum}` }]
    return
  }
  return data
}
</script>
