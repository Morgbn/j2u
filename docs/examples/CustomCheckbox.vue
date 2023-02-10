<template>
  <span @click="toggle">{{ props.modelValue ? '✅' : '❌' }}</span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: boolean
}>()
const emit = defineEmits<{(e: 'update:modelValue', value: boolean): void }>()

function toggle () {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
span {
  cursor: pointer;
  user-select: none;
}
</style>
