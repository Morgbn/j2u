<template>
  <div class="pure-control-group" :class="{ 'pure-control-group--disabled': props.disabled }">
    <span v-if="props.required" class="pure-control-required-mark">*</span>
    <label v-if="props.title">{{ props.title }}</label>
    <slot />
    <span v-if="props.error" class="pure-form-message">{{ props.error }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string,
  error?: string,
  disabled?: boolean
  required: boolean
}>(), {
  title: '',
  error: '',
  disabled: false
})
</script>

<style>
.pure-control-group label {
  display: block;
}
.pure-control-group > .form-item {
  margin-left: 12px;
}
.pure-control-group--disabled {
  opacity: 0.5;
  pointer-events: none;
}
.pure-form-message, .pure-control-required-mark {
  color: #f14668!important;
}
</style>
