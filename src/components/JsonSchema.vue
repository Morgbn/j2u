<template>
  <div class="form">
    <form novalidate>
      <form-item
        :schema="props.schema"
        :ui-schema="uiSchema"
        :model-value="modelValue"
        :components="components"
        :wrappers="wrappers"
        @update:model-value="(v: IAnyObject) => emit('update:modelValue', v)"
      />
      <button type="submit" style="position: absolute; left: -100px; visibility: hidden" @click.prevent="submit()" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { JSONSchema7, IUiSchema, IAnyObject, IConfigComponent } from '@/types'

const props = withDefaults(defineProps<{
  schema: JSONSchema7,
  uiSchema?: IUiSchema,
  modelValue?: IAnyObject,
  components?: IConfigComponent,
  wrappers?: IConfigComponent,
  errors?: any,
  useDefaultStyles?: boolean
}>(), {
  uiSchema: () => ({}),
  modelValue: () => ({}),
  components: () => ({}),
  useDefaultStyles: true
})

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

const components = computed(() => ({ ...defaultComponents, ...props.components, ...rootComponents }))
const wrappers = computed(() => props.wrappers ?? defaultWrappers)

function submit () {
  console.log('submit')
}
</script>
