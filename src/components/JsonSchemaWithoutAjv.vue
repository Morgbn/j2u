<template>
  <div class="form">
    <form novalidate @submit="e => emit('native:submit', e)">
      <form-item
        :schema="props.schema"
        :ui-schema="uiSchema"
        :model-value="modelValue"
        :read-only="readOnly"
        @update:model-value="onUpdate"
        @blur="onBlur"
      />
      <button type="submit" style="position: absolute; left: -100px; visibility: hidden" @click.prevent="e => emit('submit', e)" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, ref, watch } from 'vue'
import type { ValidateFunction } from 'ajv'
import { defaultComponents, defaultWrappers, rootComponents } from '@/utils/defaultComponents'
import FormItem from '@/components/FormItem.vue'

import type { Ref, ISchemaObject, IUiSchema, IAnyObject, IConfigComponent, IErrorObject, ISchemaArray, ILocalize } from '@/types'

const props = withDefaults(defineProps<{
  schema: ISchemaObject,
  uiSchema?: IUiSchema
  modelValue?: IAnyObject
  components?: IConfigComponent
  wrappers?: IConfigComponent
  errors?: IErrorObject[]
  validateTrigger?: 'blur'|'change'
  defsSchema?: ISchemaArray
  i18n?: ILocalize
  readOnly?: boolean
  validator: ValidateFunction<IAnyObject>
}>(), {
  uiSchema: () => ({}),
  modelValue: () => ({}),
  components: () => ({}),
  keywords: () => [],
  validateTrigger: 'blur'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: IAnyObject): void
  (e: 'submit', event: Event): void
  (e: 'native:submit', event: Event): void
}>()

provide('form', computed(() => props.modelValue))
provide('defsSchema', computed(() => props.defsSchema))
provide('components', computed(() => ({ ...defaultComponents, ...props.components, ...rootComponents })))
provide('wrappers', computed(() => ({ ...defaultWrappers, ...props.wrappers })))

const internalErrors: Ref<IErrorObject[]> = ref([])
provide('errors', computed(() => [...internalErrors.value, ...(props.errors ?? [])]))

const validateOnly: Ref<string[]> = ref([])
function validate (): boolean {
  internalErrors.value = []
  const valid = props.validator(props.modelValue)
  if (!valid) {
    const requiredMsg = props.i18n?.required ?? 'this field is required'
    if (props.i18n) { props.i18n(props.validator.errors) }
    const errors: IErrorObject[] = []
    const showAll = !validateOnly.value.length
    for (const err of (props.validator.errors ?? [])) {
      if (!showAll && !validateOnly.value.includes(err.instancePath)) {
        continue
      }
      if (err.params?.missingProperty) {
        err.instancePath += `/${err.params.missingProperty}`
        err.message = requiredMsg
      }
      errors.push(err)
    }
    internalErrors.value = errors
    return false
  }
  return true
}

function validateWith (path: string) {
  if (!validateOnly.value.includes(path)) {
    validateOnly.value.push(path)
  }
  nextTick(validate) // emit -> 1 tick -> updated
}

const onUpdate = (v: IAnyObject, path: string) => {
  emit('update:modelValue', v)
  if (props.validateTrigger === 'change') {
    validateWith(path)
  }
}

const onBlur = (ev: Event, path: string) => {
  if (props.validateTrigger === 'blur') {
    validateWith(path)
  }
}

watch(() => props.modelValue, () => { // set default values
  const stringified = JSON.stringify(props.modelValue)
  const form = JSON.parse(stringified)
  props.validator(form)
  if (JSON.stringify(form) !== stringified) {
    emit('update:modelValue', form)
  }
})

defineExpose({
  validate: () => {
    validateOnly.value = []
    return validate()
  },
  reset: () => {
    validateOnly.value = []
    internalErrors.value = []
    emit('update:modelValue', {})
  }
})
</script>
