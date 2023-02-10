<template>
  <div class="form-array">
    <template v-for="(el, i) in props.modelValue" :key="i">
      {{ i }})
      <button v-if="i" @click.prevent="swap(i, -1)">
        ▲
      </button>
      <button v-if="i < props.modelValue.length - 1" @click.prevent="swap(i, 1)">
        ▼
      </button>
      <button @click.prevent="remove(i)">
        ✕
      </button>
      <component :is="item.wrapper" v-bind="item.wrapperArgs">
        <component
          :is="item.component"
          :model-value="el"
          :components="components"
          :wrapper="wrapper"
          v-bind="item.args"
          @update:model-value="(v: any) => onInput(i, v)"
        />
      </component>
    </template>
    <button @click.prevent="addNewItem">
      Add
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { ISchemaArray, IUiSchema, IComponent, IConfigComponent, ISchema } from '@/types'

const props = withDefaults(defineProps<{
  schema: ISchemaArray,
  uiSchema: IUiSchema,
  modelValue: Array<any>
  wrapper?: IComponent
  components: IConfigComponent
}>(), {
  modelValue: () => ([])
})
const emit = defineEmits<{(e: 'update:modelValue', value: Array<any>): void }>()

const item = computed(() => {
  const { component: wrapper, props: fW } = props.wrapper ?? defaultWrapper
  const ui = props.uiSchema?.items || {}
  const uiType = ui.uiType ?? getType(props.schema.items)
  const { component, props: f } = props.components[uiType] ??
    props.components.input
  const args = f?.('item', props.schema.items, ui, props.wrapper) ?? {}
  const wrapperArgs = fW?.('item', props.schema.items, ui) ?? {}
  return { name: 'item', component, args, wrapper, wrapperArgs, uiType }
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

<style>

</style>
