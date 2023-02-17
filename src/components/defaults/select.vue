<template>
  <select :value="props.modelValue" style="appearance: button" @input="handleInput">
    <option disabled value="">
      Please select one
    </option>
    <option v-for="(option, index) in props.options" :key="index" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { watchEffect } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string,
  options?: Array<any>
}>(), {
  modelValue: '',
  options: () => []
})
const emit = defineEmits<{(e: 'update:modelValue', value: string): void }>()

watchEffect(() => {
  if (props.modelValue && !props.options.includes(props.modelValue)) {
    emit('update:modelValue', '')
  }
})

function handleInput (event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
