<template>
  <span :class="{readOnly}" @click="toggle">{{ props.modelValue ? '✅' : '❌' }}</span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: boolean
  readOnly?: boolean
}>()
const emit = defineEmits<{(e: 'update:modelValue', value: boolean): void }>()

function toggle (e: Event) {
  if (props.readOnly) { return e.preventDefault() }
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
span {
  cursor: pointer;
  user-select: none;
}
.readOnly {
  filter: grayscale(1);
  cursor: initial;
}
</style>
