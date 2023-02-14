<template>
  <component
    :is="wrappers.array.component"
    :model-value="props.modelValue"
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
        :required="items[index].required"
        :error="items[index].error"
      >
        <component
          :is="items[index].component"
          :model-value="item"
          v-bind="items[index].args"
          :path="items[index].path"
          :required="items[index].required"
          @update:model-value="(v: any) => onInput(index, v)"
        />
      </component>
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { Ref, ISchemaArray, IUiSchema, IConfigComponent, IErrorObject } from '@/types'

const props = withDefaults(defineProps<{
  name: string,
  schema: ISchemaArray,
  uiSchema: IUiSchema,
  modelValue: Array<any>
  path: string
}>(), {
  modelValue: () => ([])
})
const emit = defineEmits<{(e: 'update:modelValue', value: Array<any>): void }>()

const components = inject('components') as Ref<IConfigComponent>
const wrappers = inject('wrappers') as Ref<IConfigComponent>
const errors = inject('errors') as Ref<IErrorObject[]>

const items = computed(() => props.modelValue.map((_, i) =>
  getItemInfo(`${i}`, props.schema.items, props.uiSchema?.items || {}, props.path, components.value, wrappers.value, errors.value)))

function updateValue (action: (arg: Array<any>) => void) {
  const newVal = [...props.modelValue]
  action(newVal)
  emit('update:modelValue', newVal)
}

const onInput = (i: number, val: any) =>
  updateValue(newVal => newVal.splice(i, 1, val))

const addNewItem = () => updateValue(newVal => newVal.push(undefined))

const swap = (i: number, n: number) =>
  updateValue(newVal => ([newVal[i + n], newVal[i]] = [newVal[i], newVal[i + n]]))

const remove = (i: number) => updateValue(newVal => newVal.splice(i, 1))
</script>
