<template>
  <button class="btn" :class="{ primary }">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps({
  primary: {
    type: Boolean,
    default: false
  }
})

const { primary } = reactive(props)
</script>

<style scoped>
button {
  padding: .6rem 1.25rem;
  background-color: #747bff;
  border: 0;
}
button:hover {
  background-color: #535bf2;
}
button.primary {
  background-color: blueviolet;
}
</style>
