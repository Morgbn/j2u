<template>
  <button class="btn" :class="{ primary }">
    <slot />
  </button>
</template>

<script setup lang="ts">
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
  background-color: #ff7474;
  border: 0;
}
button:hover {
  background-color: #f25353;
}
button.primary {
  background-color: red;
}
</style>
