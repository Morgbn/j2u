<template>
  <div class="form-array">
    <template
      v-for="(item, i) in props.array"
      :key="i"
    >
      {{ i + props.offset }})
      <button
        v-if="!readOnly && i"
        @click.prevent="emit('swap', i, -1)"
      >
        ▲
      </button>
      <button
        v-if="!readOnly && i < props.array.length - 1"
        @click.prevent="emit('swap', i, 1)"
      >
        ▼
      </button>
      <button
        v-if="!readOnly"
        @click.prevent="emit('remove', i)"
      >
        ✕
      </button>
      <slot
        :item="item"
        :index="i"
      />
      <br>
    </template>
    <button
      v-if="!readOnly && (props.array.length < maxItems)"
      @click.prevent="emit('add')"
    >
      Add
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  array: Array<unknown>
  readOnly?: boolean
  maxItems?: number
  minItems?: number
  offset?: number
}>(), {
  maxItems: Infinity,
  minItems: 0,
  offset: 0
})

const emit = defineEmits<{
  (e: 'swap', index: number, direction: number): void
  (e: 'remove', index: number): void
  (e: 'add'): void
}>()
</script>
