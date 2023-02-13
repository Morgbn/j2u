<template>
  <component
    :is="components.array.component"
    :model-value="props.modelValue"
    @add="addNewItem"
    @swap="swap"
    @remove="remove"
  >
    <template #default="{ item: el, index }">
      <component :is="item.wrapper" v-bind="item.wrapperArgs">
        <component
          :is="item.component"
          :model-value="el"
          :components="components"
          :wrapper="wrapper"
          v-bind="item.args"
          @update:model-value="(v: any) => onInput(index, v)"
        />
      </component>
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { ISchemaArray, IUiSchema, IComponent, IConfigComponent, ISchema } from '@/types'

const props = withDefaults(defineProps<{
  name: string,
  schema: ISchemaArray,
  uiSchema: IUiSchema,
  modelValue: Array<any>
  wrapper: IComponent
  components: IConfigComponent
}>(), {
  modelValue: () => ([])
})
const emit = defineEmits<{(e: 'update:modelValue', value: Array<any>): void }>()

const item = computed(() => {
  const { component: wrapper, props: fW } = props.wrapper
  const ui = props.uiSchema?.items || {}
  const uiType = ui.uiType ?? getType(props.schema.items)
  const { component, props: f } = props.components[uiType] ??
    props.components.input
  const args = f?.(props.name, props.schema.items, ui, props.wrapper) ?? {}
  const wrapperArgs = fW?.(props.name, props.schema.items, ui) ?? {}
  return { name: props.name, component, args, wrapper, wrapperArgs, uiType }
})

function getType (schema?: ISchema) {
  return !schema ? 'object' : schema.enum ? 'select' : schema.type
}

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
