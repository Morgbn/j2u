<template>
  <input
    type="checkbox"
    :checked="!!props.modelValue"
    :readonly="readOnly"
    :disabled="readOnly"
    @input="handleInput"
  >
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string | boolean
  readOnly?: boolean
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string | boolean): void }>()

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>
