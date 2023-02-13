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
        v-bind="item.args"
        :model-value="props.modelValue[item.name]"
        :path="item.path"
        @update:model-value="(v: any) => onInput(item.name, v)"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
import type { ISchemaObject, IUiSchema, IAnyObject, IComponent, IConfigComponent, ISchema } from '@/types'

const props = withDefaults(defineProps<{
  schema: ISchemaObject
  uiSchema: IUiSchema
  modelValue: IAnyObject
  wrapper: IComponent
  components: IConfigComponent
  path?: string
}>(), {
  modelValue: () => ({}),
  path: '$form'
})

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

const arrayComponent = defineAsyncComponent(() => import('./FormArray.vue'))
const items = computed(() => {
  const { component: wrapper, props: fW } = props.wrapper
  return Object.entries(props.schema.properties)
    .map(([name, schema]: [string, ISchema]) => {
      const uiSchema = props.uiSchema.properties?.[name] || {}
      const wrapperArgs = fW?.(name, schema, uiSchema) ?? {}
      const uiType = uiSchema.uiType ?? getType(schema)
      const path = `${props.path}.${name}`
      if (schema.type === 'array') {
        const args = { ...props, name: '', schema, uiSchema }
        return { name, component: arrayComponent, args, wrapper, wrapperArgs, path }
      }
      const { component, props: f } = props.components[uiType] ??
        props.components.input
      const args = f?.(name, schema, uiSchema, props.wrapper) ?? {}
      return { name, component, args, wrapper, wrapperArgs, path }
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
