<template>
  <div>
    <label
      v-for="(option, index) in props.options"
      :key="index"
      :for="path + option"
      style="margin-left: 1px"
    >
      <input
        :id="path + option"
        type="radio"
        :checked="props.modelValue + '' === option"
        :value="option"
        :readonly="readOnly"
        :disabled="readOnly"
        @input="handleInput"
      >
      {{ option }}
    </label>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  name?: string
  modelValue?: string
  options?: Array<unknown>
  path: string
  readOnly?: boolean
}>(), {
  name: '',
  modelValue: '',
  options: () => []
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
