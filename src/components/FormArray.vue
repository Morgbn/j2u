<template>
  <component
    :is="props.wrappers.array.component"
    :model-value="props.modelValue"
    :name="name"
    :schema="schema"
    :ui-schema="uiSchema"
    :path="path"
    @add="addNewItem"
    @swap="swap"
    @remove="remove"
  >
    <template #default="{ item: el, index }">
      <component :is="item.wrapper" v-bind="item.wrapperArgs">
        <component
          :is="item.component"
          :model-value="el"
          v-bind="item.args"
          :path="`${path}[${index}]`"
          @update:model-value="(v: any) => onInput(index, v)"
        />
      </component>
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { ISchemaArray, IUiSchema, IConfigComponent } from '@/types'

const props = withDefaults(defineProps<{
  name: string,
  schema: ISchemaArray,
  uiSchema: IUiSchema,
  modelValue: Array<any>
  wrappers: IConfigComponent
  components: IConfigComponent
  path: string
}>(), {
  modelValue: () => ([])
})
const emit = defineEmits<{(e: 'update:modelValue', value: Array<any>): void }>()

const item = computed(() =>
  getItemInfo(props.name, props.schema.items, props.uiSchema?.items || {}, props.path, props.components, props.wrappers))

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
