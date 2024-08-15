<template>
  <div :style="{ '--color': props.color(form) }">
    {{ props.text(form) }}
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'

const props = withDefaults(defineProps<{
  text: (form: unknown) => string
  color?: (form: unknown) => string
}>(), {
  color: () => '#b7b7b7'
})

const form = inject('form') as Ref
</script>

<style scoped>
div {
  padding: 6px 12px;
  background-color: var(--color);
  border-radius: 4px;
  font-weight: 600;
}
</style>
