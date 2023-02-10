<template>
  <select class="json-schema-form-select" @input="handleInput">
    <option style="display:none;" :selected="!props.modelValue ? 'true' : 'false'" />
    <option
      v-for="(option, index) in options"
      :key="index"
      :selected="option === props.modelValue ? 'true' : 'false'"
      :value="option"
    >
      {{ option }}
    </option>
  </select>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue?: string,
  options?: Array<any>
}>(), {
  modelValue: '',
  options: () => []
})
const emit = defineEmits<{(e: 'update:modelValue', value: string): void }>()

function handleInput (event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style>
.json-schema-form-select {
  appearance: button;
}
</style>
