<template>
  <div class="form">
    <form novalidate>
      <form-item
        :schema="props.schema"
        :ui-schema="uiSchema"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        @blur="onBlur"
      />
      <button type="submit" style="position: absolute; left: -100px; visibility: hidden" @click.prevent="e => emit('submit', e)" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import Ajv from 'ajv'
import type { Ref, JSONSchema7, IUiSchema, IAnyObject, IConfigComponent, IErrorObject, ISchemaArray, ILocalize } from '@/types'

const ajv = new Ajv({ allErrors: true, useDefaults: true })

const props = withDefaults(defineProps<{
  schema: JSONSchema7,
  uiSchema?: IUiSchema
  modelValue?: IAnyObject
  components?: IConfigComponent
  wrappers?: IConfigComponent
  errors?: IErrorObject[]
  validateTrigger?: 'blur'|'change'
  useDefaultStyles?: boolean
  defsSchema?: ISchemaArray
  i18n?: ILocalize
}>(), {
  uiSchema: () => ({}),
  modelValue: () => ({}),
  components: () => ({}),
  useDefaultStyles: true,
  validateTrigger: 'blur'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: IAnyObject): void
  (e: 'submit', event: Event): void
}>()

provide('defsSchema', computed(() => props.defsSchema))
provide('components', computed(() => ({ ...defaultComponents, ...props.components, ...rootComponents })))
provide('wrappers', computed(() => ({ ...defaultWrappers, ...props.wrappers })))

const internalErrors: Ref<IErrorObject[]> = ref([])
provide('errors', computed(() => [...internalErrors.value, ...(props.errors ?? [])]))

const validator = computed(() => {
  if (props.defsSchema) {
    return ajv.addSchema(props.defsSchema).compile(props.schema)
  }
  return ajv.compile(props.schema)
})

const validateOnly: Ref<string[]> = ref([])
function validate (): boolean {
  const valid = validator.value(props.modelValue)
  if (!valid) {
    const requiredMsg = props.i18n?.required ?? 'this field is required'
    if (props.i18n) { props.i18n(validator.value.errors) }
    const errors: IErrorObject[] = []
    const showAll = !validateOnly.value.length
    for (const err of (validator.value.errors ?? [])) {
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

const onUpdate = debounce((v: IAnyObject, path: string) => {
  emit('update:modelValue', v)
  if (props.validateTrigger === 'change') {
    validateWith(path)
  }
})

const onBlur = debounce((ev: Event, path: string) => {
  if (props.validateTrigger === 'blur') {
    validateWith(path)
  }
})

watch(() => props.modelValue, () => { // set default values
  const stringified = JSON.stringify(props.modelValue)
  const form = JSON.parse(stringified)
  validator.value(form)
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
