<template>
  <div class="form">
    <form novalidate>
      <form-item
        :schema="props.schema"
        :ui-schema="uiSchema"
        :model-value="modelValue"
        @update:model-value="(v: IAnyObject) => emit('update:modelValue', v)"
      />
      <button type="submit" style="position: absolute; left: -100px; visibility: hidden" @click.prevent="submit()" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import Ajv from 'ajv'
import type { Ref, JSONSchema7, IUiSchema, IAnyObject, IConfigComponent, IErrorObject, ISchemaArray } from '@/types'

const ajv = new Ajv({ allErrors: true })

const props = withDefaults(defineProps<{
  schema: JSONSchema7,
  uiSchema?: IUiSchema
  modelValue?: IAnyObject
  components?: IConfigComponent
  wrappers?: IConfigComponent
  errors?: IErrorObject[]
  useDefaultStyles?: boolean
  defsSchema?: ISchemaArray
}>(), {
  uiSchema: () => ({}),
  modelValue: () => ({}),
  components: () => ({}),
  useDefaultStyles: true
})

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

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
const validate = () => {
  const valid = validator.value(props.modelValue)
  if (!valid) {
    internalErrors.value = (validator.value.errors ?? [])
    for (const err of internalErrors.value) {
      if (err.params?.missingProperty) {
        err.instancePath += `/${err.params.missingProperty}`
        err.message = 'this field is required'
      }
    }
    return false
  }
  return true
}

defineExpose({ validate })

function submit () {
  console.log('submit')
}
</script>
