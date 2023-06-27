<template>
  <template v-for="(tSchema, index) in tuple" :key="index">
    <component
      :is="tSchema.wrapper"
      v-bind="tSchema.wrapperArgs"
      v-show="cond(tSchema)"
      :required="tSchema.required"
      :error="tSchema.error"
      :read-only="readOnly || tSchema.readOnly"
    >
      <component
        :is="tSchema.component"
        :model-value="tupleValues[index]"
        v-bind="tSchema.args"
        :path="tSchema.path"
        :required="tSchema.required"
        :read-only="readOnly || tSchema.readOnly"
        @update:model-value="(v: any, p?: string) => onInput(index, v, p)"
        @blur="(ev: Event, path?: string) => tSchema ? emit('blur', ev, path ?? tSchema.path) : null"
      />
    </component>
  </template>
  <component
    :is="wrappers.array.component"
    v-bind="arrayWrapperArgs"
    v-if="items"
    :array="itemsValues"
    :max-items="maxItems"
    :min-items="minItems"
    :name="name"
    :schema="schema"
    :ui-schema="uiSchema"
    :path="path"
    :read-only="readOnly"
    :required="required"
    :offset="tupleValues.length"
    @add="addNewItem"
    @swap="(i: number, n: number) => swap(i + tupleValues.length, n)"
    @remove="(i: number) => remove(i + tupleValues.length)"
  >
    <template #default="{ item, index }">
      <component
        :is="items[index].wrapper"
        v-bind="items[index].wrapperArgs"
        v-show="cond(items[index])"
        :required="items[index].required"
        :error="items[index].error"
        :read-only="readOnly || items[index].readOnly"
      >
        <component
          :is="items[index].component"
          :model-value="item"
          v-bind="items[index].args"
          :path="items[index].path"
          :required="items[index].required"
          :read-only="readOnly || items[index].readOnly"
          @update:model-value="(v: any, p?: string) => onInput(index + tupleValues.length, v, p)"
          @blur="(ev: Event, path?: string) => items ? emit('blur', ev, path ?? items[index].path) : null"
        />
      </component>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { inject, computed, watch } from 'vue'
import { getItemInfo } from '@/utils/item'

import type { Ref, ISchemaArray, IUiSchema, IAnyObject, IConfigComponent, IErrorObject } from '@/types'

const props = withDefaults(defineProps<{
  name: string,
  schema: ISchemaArray
  uiSchema: IUiSchema
  modelValue: Array<any>
  path: string
  readOnly?: boolean
  required?: boolean
}>(), {
  modelValue: () => ([])
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<any>, path: string): void
  (e: 'blur', ev: Event, path: string): void
}>()

const form = inject('form') as Ref<IAnyObject>
const defsSchema = inject('defsSchema') as Ref<ISchemaArray>
const components = inject('components') as Ref<IConfigComponent>
const wrappers = inject('wrappers') as Ref<IConfigComponent>
const errors = inject('errors') as Ref<IErrorObject[]>

const tuple = computed(() => {
  if (!Array.isArray(props.schema.items)) { return null }
  const uiSchemas = Array.isArray(props.uiSchema?.items) ? props.uiSchema.items : []
  return props.schema.items.map((schema, i) =>
    getItemInfo(`${i}`, schema, uiSchemas[i] ?? {}, props.path, components.value, wrappers.value, defsSchema.value, errors.value))
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
})

const tupleValues = computed(() => Array.isArray(props.schema.items)
  ? props.modelValue.slice(0, props.schema.items.length)
  : [])

const items = computed(() => {
  const schema = tuple.value ? props.schema.additionalItems : props.schema.items
  const uiSchemas = tuple.value ? props.uiSchema?.additionalItems : props.uiSchema?.items
  if (!schema || Array.isArray(schema)) { return null }
  const items = []
  const max = Math.min(props.modelValue.length, props.schema.maxItems ?? Infinity)
  for (let i = tupleValues.value.length; i < max; i++) {
    items.push(getItemInfo(`${i}`, schema, uiSchemas ?? {}, props.path, components.value, wrappers.value, defsSchema.value, errors.value))
  }
  return items
})

const itemsValues = computed(() => Array.isArray(props.schema.items)
  ? props.modelValue.slice(props.schema.items.length)
  : props.modelValue)

const maxItems = computed(() => (props.schema.maxItems ?? Infinity) - (tuple.value?.length ?? 0))
const minItems = computed(() => (props.schema.minItems ?? -Infinity) - (tuple.value?.length ?? 0))

const arrayWrapperArgs = computed(() => wrappers.value.array.props?.(props.name, props.schema, props.uiSchema) ?? {})

watch(() => props.modelValue, (v) => {
  const val = v ?? []
  const { items, minItems } = props.schema
  if (Array.isArray(items) && val.length < (minItems ?? 0)) {
    const newVal = items.map((_, i) => val[i])
    emit('update:modelValue', newVal, props.path)
  }
}, { immediate: true })

function updateValue (action: (arg: Array<any>) => void, path?: string) {
  const newVal = [...(props.modelValue ?? [])]
  action(newVal)
  emit('update:modelValue', newVal, path ?? props.path)
}

const cond = (item: any) => !item.cond || item.cond(form, item.path)

const onInput = (i: number, val: any, path?: string) =>
  updateValue(newVal => newVal.splice(i, 1, val), path)

const addNewItem = () => updateValue(newVal => newVal.push(undefined))

const swap = (i: number, n: number) =>
  updateValue(newVal => ([newVal[i + n], newVal[i]] = [newVal[i], newVal[i + n]]))

const remove = (i: number) => updateValue(newVal => newVal.splice(i, 1))
</script>
