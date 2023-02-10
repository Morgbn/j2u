<template>
  <div class="name">
    <component
      :is="item.wrapper"
      v-for="item in items"
      :key="item.name"
      v-bind="item.wrapperArgs"
    >
      <component
        :is="item.component"
        :model-value="modelValue[item.name]"
        v-bind="item.args"
        @update:model-value="(v: any) => onInput(item.name, v)"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
import type { ISchemaObject, IUiSchema, IAnyObject, IComponent, ISchema, IConfigComponent } from '@/types'

const defaultComponents: IConfigComponent = {
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
  radio: {
    component: defineAsyncComponent(() => import('@/components/defaults/radio.vue')),
    props: (propName, schema) => ({ options: schema.enum })
  }
}

const defaultWrapper: IComponent = {
  component: defineAsyncComponent(() => import('@/components/defaults/wrapper.vue')),
  props: (propName, schema, uiSchema) => ({
    title: schema.title || schema.title === '' ? schema.title : propName,
    disabled: uiSchema?.disabled
  })
}

const props = defineProps<{
  schema: ISchemaObject,
  uiSchema: IUiSchema,
  modelValue: IAnyObject
  wrapper?: IComponent
}>()

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

const items = computed(() => {
  const { component: wrapper, props: fW } = props.wrapper ?? defaultWrapper
  return Object.entries(props.schema.properties)
    .map(([name, schema]: [string, ISchema]) => {
      const ui = props.uiSchema.properties?.[name] || {}
      const uiType = ui.uiType ?? schema.type
      const { component, props: f } = defaultComponents[uiType] ??
        defaultComponents.input
      const args = f?.(name, schema, ui) ?? {}
      const wrapperArgs = fW?.(name, schema, ui) ?? {}
      return { name, component, args, wrapper, wrapperArgs }
    })
})

function onInput (key: string, val: any) {
  const newVal = { ...props.modelValue } as IAnyObject
  newVal[key] = val
  emit('update:modelValue', newVal)
}
</script>
