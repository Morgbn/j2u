import type { IConfigComponent, IComponent } from '@/types'

export const defaultComponents: IConfigComponent = {
  radio: {
    component: defineAsyncComponent(() => import('@/components/defaults/radio.vue')),
    props: (propName, schema) => ({
      options: schema.enum
    })
  }
}

export const defaultWrapper: IComponent = {
  component: defineAsyncComponent(() => import('@/components/defaults/wrapper.vue')),
  props: (propName, schema, uiSchema) => ({
    title: schema.title || schema.title === '' ? schema.title : propName,
    disabled: uiSchema?.disabled
  })
}
