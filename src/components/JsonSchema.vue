<template>
  <div class="form">
    <form novalidate>
      <form-item
        :schema="props.schema"
        :ui-schema="uiSchema"
        :model-value="modelValue"
        :components="components"
        :wrappers="wrappers"
        :errors="errors"
        @update:model-value="(v: IAnyObject) => emit('update:modelValue', v)"
      />
      <button type="submit" style="position: absolute; left: -100px; visibility: hidden" @click.prevent="submit()" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import Ajv from 'ajv'
import type { Ref, JSONSchema7, IUiSchema, IAnyObject, IConfigComponent, IErrorObject } from '@/types'

const ajv = new Ajv({ allErrors: true })

const props = withDefaults(defineProps<{
  schema: JSONSchema7,
  uiSchema?: IUiSchema
  modelValue?: IAnyObject
  components?: IConfigComponent
  wrappers?: IConfigComponent
  errors?: IErrorObject[]
  useDefaultStyles?: boolean
}>(), {
  uiSchema: () => ({}),
  modelValue: () => ({}),
  components: () => ({}),
  useDefaultStyles: true
})

const emit = defineEmits<{(e: 'update:modelValue', value: IAnyObject): void }>()

const components = computed(() => ({ ...defaultComponents, ...props.components, ...rootComponents }))
const wrappers = computed(() => ({ ...defaultWrappers, ...props.wrappers }))

const errors: Ref<IErrorObject[]> = ref([])
const validator = computed(() => ajv.compile(props.schema))
const validate = () => {
  const valid = validator.value(props.modelValue)
  if (!valid) {
    errors.value = (validator.value.errors ?? [])
    for (const err of errors.value) {
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
