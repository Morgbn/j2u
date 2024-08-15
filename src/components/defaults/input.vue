<template>
  <input
    :type="isNumber ? 'number' : props.type"
    :value="props.modelValue"
    :step="props.type === 'float' ? 0.1 : ''"
    :readonly="readOnly"
    :disabled="readOnly"
    @input="handleInput"
  >
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: 'text' | 'integer' | 'float'
  allowNegative?: boolean
  readOnly?: boolean
}>(), {
  modelValue: '',
  type: 'text',
  allowNegative: true
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | undefined): void }>()

const isNumber = computed(() => props.type === 'integer' || props.type === 'float')
const isFloat = computed(() => props.type === 'float')

function handleInput(event: Event) {
  const val = (event.target as HTMLInputElement).value
  if (isNumber.value) {
    if (val === '') return emit('update:modelValue', undefined)
    return emit('update:modelValue', isFloat.value ? Number.parseFloat(val) : Number.parseInt(val))
  }
  emit('update:modelValue', val)
}
</script>
