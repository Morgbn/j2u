<template>
  <div class="form-array">
    <template v-for="(item, i) in props.modelValue" :key="i">
      🗒️{{ i }}
      <button v-if="i" @click.prevent="emit('swap', i, -1)">
        🔼
      </button>
      <button v-if="i < props.modelValue.length - 1" @click.prevent="emit('swap', i, 1)">
        🔽
      </button>
      <button style="float: right" @click.prevent="emit('remove', i)">
        🗑️
      </button>
      <slot :item="item" :index="i" />
      <br>
    </template>
    <button @click.prevent="emit('add')">
      ➕Add
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: Array<any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<any>): void
  (e: 'swap', index: number, direction: number): void
  (e: 'remove', index: number): void
  (e: 'add'): void
}>()
</script>
