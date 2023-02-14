<template>
  <div class="form-item">
    <component
      :is="item.wrapper"
      v-for="item in items"
      :key="item.name"
      v-bind="item.wrapperArgs"
      :required="item.required"
      :error="item.error"
    >
      <component
        :is="item.component"
        v-if="props.modelValue"
        v-bind="item.args"
        :model-value="props.modelValue[item.name]"
        :path="item.path"
        :required="item.required"
        @update:model-value="(v: any) => onInput(item.name, v)"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
import type { Ref, ISchemaObject, IUiSchema, IAnyObject, IConfigComponent, ISchema, IErrorObject } from '@/types'

const props = withDefaults(defineProps<{
  schema: ISchemaObject
  uiSchema: IUiSchema
  modelValue: IAnyObject
  path?: string
}>(), {
  modelValue: () => ({}),
  path: ''
})

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

const components = inject('components') as Ref<IConfigComponent>
const wrappers = inject('wrappers') as Ref<IConfigComponent>
const errors = inject('errors') as Ref<IErrorObject[]>

const items = computed(() => {
  return Object.entries(props.schema.properties)
    .map(([name, schema]: [string, ISchema]) => getItemInfo(name, schema, props.uiSchema.properties?.[name] || {}, props.path, components.value, wrappers.value, errors.value, props.schema.required ?? []))
})

function onInput (key: string, val: any) {
  const newVal = { ...props.modelValue } as IAnyObject
  newVal[key] = val
  emit('update:modelValue', newVal)
}
</script>
