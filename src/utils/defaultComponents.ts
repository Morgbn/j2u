import { defineAsyncComponent } from 'vue'
import type { IConfigComponent } from '@/types'

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
    props: (_, schema) => ({ options: schema.enum })
  },
  radio: {
    component: defineAsyncComponent(() => import('@/components/defaults/radio.vue')),
    props: (propName, schema) => ({ name: propName, options: schema.enum })
  }
}

export const rootComponents: IConfigComponent = {
  object: {
    component: defineAsyncComponent(() => import('@/components/FormItem.vue')),
    props: (_, schema, uiSchema) => ({ schema, uiSchema })
  },
  array: {
    component: defineAsyncComponent(() => import('@/components/FormArray.vue')),
    props: (_, schema, uiSchema) => ({ schema, uiSchema })
  }
}

export const defaultWrappers: IConfigComponent = {
  item: {
    component: defineAsyncComponent(() => import('@/components/defaults/wrapper.vue')),
    props: (propName, schema, uiSchema) => ({
      title: schema.title || schema.title === '' ? schema.title : propName,
      disabled: uiSchema?.disabled
    })
  },
  array: {
    component: defineAsyncComponent(() => import('@/components/defaults/array.vue'))
  }
}
