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
import type { ISchemaObject, IUiSchema, IAnyObject, IConfigComponent, ISchema } from '@/types'

const props = withDefaults(defineProps<{
  schema: ISchemaObject
  uiSchema: IUiSchema
  modelValue: IAnyObject
  wrappers: IConfigComponent
  components: IConfigComponent
  path?: string
}>(), {
  modelValue: () => ({}),
  path: '$form'
})

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

const items = computed(() => {
  return Object.entries(props.schema.properties)
    .map(([name, schema]: [string, ISchema]) => getItemInfo(name, schema, props.uiSchema.properties?.[name] || {}, props.path, props.components, props.wrappers))
})

function onInput (key: string, val: any) {
  const newVal = { ...props.modelValue } as IAnyObject
  newVal[key] = val
  emit('update:modelValue', newVal)
}
</script>
