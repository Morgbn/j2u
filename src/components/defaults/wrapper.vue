<template>
  <div
    class="pure-control-group"
    :class="{ 'pure-control-group--disabled': props.disabled }"
  >
    <label v-if="props.title">
      {{ props.title }}
      <small><em v-if="!props.required">- Optional</em></small>
    </label>
    <slot />
    <span
      v-if="props.error"
      class="pure-form-message"
    >{{ props.error.message }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { IErrorObject } from '@/types'

const props = withDefaults(defineProps<{
  title?: string
  error?: IErrorObject
  disabled?: boolean
  required: boolean
}>(), {
  title: '',
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
.pure-form-message {
  color: #f14668!important;
}
</style>
