import { defineAsyncComponent } from 'vue'
import type { IConfigComponent, IComponent } from '@/types'

export const defaultComponents: IConfigComponent = {
  string: {
    component: defineAsyncComponent(() => import('@/components/defaults/input.vue')),
    props: () => ({ type: 'text' })
  },
  number: {
    component: defineAsyncComponent(() => import('@/components/defaults/input.vue')),
    props: () => ({ type: 'float' })
  },
  integer: {
    component: defineAsyncComponent(() => import('@/components/defaults/input.vue')),
    props: () => ({ type: 'integer' })
  },
  boolean: {
    component: defineAsyncComponent(() => import('@/components/defaults/checkbox.vue'))
  },
  select: {
    component: defineAsyncComponent(() => import('@/components/defaults/select.vue')),
    props: (propName, schema) => ({ options: schema.enum })
  },
  radio: {
    component: defineAsyncComponent(() => import('@/components/defaults/radio.vue')),
    props: (propName, schema) => ({ name: propName, options: schema.enum })
  },
  object: {
    component: defineAsyncComponent(() => import('@/components/FormItem.vue')),
    props: (propName, schema, uiSchema, wrapper) => {
      return { schema, uiSchema, wrapper }
    }
  },
  array: {
    component: defineAsyncComponent(() => import('@/components/defaults/array.vue')),
    props: (propName, schema, uiSchema, wrapper) => {
      return { schema, uiSchema, wrapper }
    }
  }
}

export const defaultWrapper: IComponent = {
  component: defineAsyncComponent(() => import('@/components/defaults/wrapper.vue')),
  props: (propName, schema, uiSchema) => ({
    title: schema.title || schema.title === '' ? schema.title : propName,
    disabled: uiSchema?.disabled
  })
}
