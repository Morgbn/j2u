<template>
  <div class="form-item">
    <component
      :is="item.wrapper"
      v-for="item in items"
      :key="item.name"
      v-bind="item.wrapperArgs"
    >
      <component
        :is="item.component"
        v-if="props.modelValue"
        :model-value="props.modelValue[item.name]"
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
  select: {
    component: defineAsyncComponent(() => import('@/components/defaults/select.vue')),
    props: (propName, schema) => ({ options: schema.enum })
  },
  radio: {
    component: defineAsyncComponent(() => import('@/components/defaults/radio.vue')),
    props: (propName, schema) => ({ options: schema.enum })
  },
  object: {
    component: defineAsyncComponent(() => import('@/components/FormItem.vue')),
    props: (propName, schema, uiSchema, wrapper) => {
      return { schema, uiSchema, wrapper }
    }
  }
}

const defaultWrapper: IComponent = {
  component: defineAsyncComponent(() => import('@/components/defaults/wrapper.vue')),
  props: (propName, schema, uiSchema) => ({
    title: schema.title || schema.title === '' ? schema.title : propName,
    disabled: uiSchema?.disabled
  })
}

const props = withDefaults(defineProps<{
  schema: ISchemaObject,
  uiSchema: IUiSchema,
  modelValue: IAnyObject
  wrapper?: IComponent
}>(), {
  modelValue: () => ({})
})

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

const items = computed(() => {
  const { component: wrapper, props: fW } = props.wrapper ?? defaultWrapper
  return Object.entries(props.schema.properties)
    .map(([name, schema]: [string, ISchema]) => {
      const ui = props.uiSchema.properties?.[name] || {}
      const uiType = ui.uiType ?? getType(schema)
      const { component, props: f } = defaultComponents[uiType] ??
        defaultComponents.input
      const args = f?.(name, schema, ui, props.wrapper) ?? {}
      const wrapperArgs = fW?.(name, schema, ui) ?? {}
      return { name, component, args, wrapper, wrapperArgs, uiType }
    })
})

function getType (schema: ISchema) {
  return schema.enum ? 'select' : schema.type
}

function onInput (key: string, val: any) {
  const newVal = { ...props.modelValue } as IAnyObject
  newVal[key] = val
  emit('update:modelValue', newVal)
}
</script>
