<template>
  <div class="form">
    <form
      novalidate
      @submit="e => emit('native:submit', e)"
    >
      <form-item
        :schema="props.schema"
        :ui-schema="uiSchema"
        :model-value="modelValue"
        :read-only="readOnly"
        @update:model-value="onUpdate"
        @blur="onBlur"
      />
      <button
        type="submit"
        style="position: absolute; left: -100px; visibility: hidden"
        @click.prevent="e => emit('submit', e)"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { createDefu } from 'defu'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { computed, nextTick, provide, ref, watch } from 'vue'
import { defaultComponents, defaultWrappers, rootComponents } from '@/utils/defaultComponents'
import FormItem from '@/components/FormItem.vue'

import type { Ref, ISchemaObject, IUiSchema, IAnyObject, IConfigComponent, IErrorObject, KeywordDefinition, ILocalize, IDefSchema } from '@/types'

const defuReplaceArray = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) || Array.isArray(value)) {
    obj[key] = value
    return true
  }
})

const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: 'log' })
addFormats(ajv)

const props = withDefaults(defineProps<{
  schema: ISchemaObject
  uiSchema?: IUiSchema
  modelValue?: IAnyObject | null
  components?: IConfigComponent
  wrappers?: IConfigComponent
  errors?: IErrorObject[]
  validateTrigger?: 'blur' | 'change'
  defsSchema?: IDefSchema | IDefSchema[]
  keywords?: (KeywordDefinition & { removeKeyword?: string })[]
  i18n?: ILocalize
  readOnly?: boolean
}>(), {
  uiSchema: () => ({}),
  modelValue: () => ({}),
  components: () => ({}),
  keywords: () => [],
  validateTrigger: 'blur'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: IAnyObject): void
  (e: 'submit' | 'native:submit', event: Event): void
}>()

provide('form', computed(() => props.modelValue))
provide('defsSchema', computed(() => props.defsSchema))
provide('components', computed(() => ({ ...defaultComponents, ...props.components, ...rootComponents })))
provide('wrappers', computed(() => ({ ...defaultWrappers, ...props.wrappers })))

const internalErrors: Ref<IErrorObject[]> = ref([])
provide('errors', computed(() => [...internalErrors.value, ...(props.errors ?? [])]))

watch(() => props.keywords, (keywords) => {
  for (const keyword of keywords) {
    if (keyword.removeKeyword) ajv.removeKeyword(keyword.removeKeyword)
    ajv.addKeyword(keyword)
  }
}, { immediate: true })

const validator = ref<ReturnType<typeof ajv.compile>>()
const defIdAdded = new Set()
watch(() => [props.schema, props.defsSchema] as const, ([schema, defs]) => {
  for (const d of Array.isArray(defs) ? defs : [defs]) {
    if (d && !defIdAdded.has(d.$id)) {
      ajv.addSchema(d)
      defIdAdded.add(d.$id)
    }
  }
  if (schema) validator.value = ajv.compile(schema)
}, { immediate: true })

const validateOnly: Ref<string[]> = ref([])
function validate(): boolean {
  if (!validator.value) throw new Error('validator is not defined, check props.schema')
  internalErrors.value = []
  const valid = validator.value(props.modelValue)
  if (!valid) {
    const requiredMsg = props.i18n?.required ?? 'this field is required'
    if (props.i18n) props.i18n(validator.value.errors)
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

function validateWith(path: string) {
  if (!validateOnly.value.includes(path)) {
    validateOnly.value.push(path)
  }
  nextTick(validate) // emit -> 1 tick -> updated
}

let currentTickUpdate = {}
const onUpdate = (v: IAnyObject, path: string) => {
  currentTickUpdate = defuReplaceArray(currentTickUpdate, v)
  emit('update:modelValue', currentTickUpdate)
  nextTick(() => (currentTickUpdate = {}))
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
  if (!validator.value) throw new Error('validator is not defined, check props.schema')
  const stringified = JSON.stringify(props.modelValue)
  const form = JSON.parse(stringified)
  validator.value(form)
  if (JSON.stringify(form) !== stringified) {
    emit('update:modelValue', form)
  }
})

defineExpose({
  ajv,
  validator,
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
