<template>
  <div class="form-item">
    <component
      :is="item.wrapper"
      v-for="item in items"
      v-show="!item.cond || item.cond(form, item.path)"
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
        @update:model-value="(v: any, p: string) => onInput(item, v, p)"
        @blur="(ev: Event, path?: string) => emit('blur', ev, path ?? item.path)"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
import type { Ref, ISchemaObject, IUiSchema, IAnyObject, IConfigComponent, ISchemaArray, ISchema, IErrorObject } from '@/types'

const props = withDefaults(defineProps<{
  schema: ISchemaObject
  uiSchema: IUiSchema
  modelValue: IAnyObject
  path?: string
}>(), {
  path: ''
})

onMounted(() => {
  if (props.modelValue === undefined) {
    emit('update:modelValue', {}, props.path)
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: IAnyObject, path: string): void
  (e: 'blur', ev: Event, path: string): void
}>()

const form = inject('form') as Ref<IAnyObject>
const defsSchema = inject('defsSchema') as Ref<ISchemaArray>
const components = inject('components') as Ref<IConfigComponent>
const wrappers = inject('wrappers') as Ref<IConfigComponent>
const errors = inject('errors') as Ref<IErrorObject[]>

const items = computed(() => {
  return Object.entries(props.schema?.properties || {})
    .map(([name, schema]: [string, ISchema]) => getItemInfo(name, schema, props.uiSchema.properties?.[name] || {}, props.path, components.value, wrappers.value, defsSchema.value, errors.value, props.schema.required ?? []))
})

function onInput ({ name, path }: { name: string, path: string }, val: any, fromPath?: string) {
  const newVal = { ...props.modelValue } as IAnyObject
  newVal[name] = val
  emit('update:modelValue', newVal, fromPath ?? path)
}
</script>
