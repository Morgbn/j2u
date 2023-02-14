<template>
  <component
    :is="wrappers.array.component"
    :array="props.modelValue"
    :name="name"
    :schema="schema"
    :ui-schema="uiSchema"
    :path="path"
    @add="addNewItem"
    @swap="swap"
    @remove="remove"
  >
    <template #default="{ item, index }">
      <component
        :is="items[index].wrapper"
        v-bind="items[index].wrapperArgs"
        v-show="!items[index].cond || items[index].cond(form, items[index].path)"
        :required="items[index].required"
        :error="items[index].error"
      >
        <component
          :is="items[index].component"
          :model-value="item"
          v-bind="items[index].args"
          :path="items[index].path"
          :required="items[index].required"
          @update:model-value="(v: any, p?: string) => onInput(index, v, p)"
          @blur="(ev: Event, path?: string) => emit('blur', ev, path ?? items[index].path)"
        />
      </component>
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { Ref, ISchemaArray, IUiSchema, IAnyObject, IConfigComponent, IErrorObject } from '@/types'

const props = withDefaults(defineProps<{
  name: string,
  schema: ISchemaArray,
  uiSchema: IUiSchema,
  modelValue: Array<any>
  path: string
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

const items = computed(() => props.modelValue.map((_, i) =>
  getItemInfo(`${i}`, props.schema.items, props.uiSchema?.items || {}, props.path, components.value, wrappers.value, defsSchema.value, errors.value)))

function updateValue (action: (arg: Array<any>) => void, path?: string) {
  const newVal = [...props.modelValue]
  action(newVal)
  emit('update:modelValue', newVal, path ?? props.path)
}

const onInput = (i: number, val: any, path?: string) =>
  updateValue(newVal => newVal.splice(i, 1, val), path)

const addNewItem = () => updateValue(newVal => newVal.push(undefined))

const swap = (i: number, n: number) =>
  updateValue(newVal => ([newVal[i + n], newVal[i]] = [newVal[i], newVal[i + n]]))

const remove = (i: number) => updateValue(newVal => newVal.splice(i, 1))
</script>
