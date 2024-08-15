<template>
  <div
    class="custom-wrapper"
    :class="{ disabled: props.disabled }"
  >
    <label v-if="props.title">
      <span class="hand-emoji">👉</span>
      {{ props.title }}
      <small><em v-if="!props.required">- Optional</em></small>
    </label>
    <div class="content">
      <slot />
    </div>
    <span
      v-if="props.error"
      class="error"
    >⚠️{{ props.error.message }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
  error?: { message: string }
  disabled?: boolean
  required: boolean
}>(), {
  title: '',
  disabled: false
})
</script>

<style>
.custom-wrapper > label .hand-emoji {
  filter: grayscale(1);
}
.custom-wrapper:hover > label .hand-emoji {
  filter: grayscale(0);
}
.custom-wrapper.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
.custom-wrapper .error {
  color: #ffb02e !important;
}
.custom-wrapper .content {
  display: block;
}
.custom-wrapper .content input, .custom-wrapper .content select {
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
.custom-wrapper .form-item, .custom-wrapper .form-array {
  padding: 12px;
  margin-left: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>
