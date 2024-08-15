<template>
  <div class="form-array">
    <template
      v-for="(item, i) in props.array"
      :key="i"
    >
      {{ labelFunction(i) }}
      <template v-if="!readOnly">
        <button
          v-if="i"
          @click.prevent="emit('swap', i, -1)"
        >
          🔼
        </button>
        <button
          v-if="i < props.array.length - 1"
          @click.prevent="emit('swap', i, 1)"
        >
          🔽
        </button>
        <button
          style="float: right"
          @click.prevent="emit('remove', i)"
        >
          🗑️
        </button>
      </template>
      <slot
        :item="item"
        :index="i"
      />
      <br>
    </template>
    <button
      v-if="!readOnly && (props.array.length < maxItems)"
      @click.prevent="emit('add', props.defaultItem)"
    >
      ➕Add
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  array: Array<unknown>
  readOnly?: boolean
  maxItems?: number
  minItems?: number
  labelFunction?: (i: number) => string
  defaultItem?: Record<string, unknown>
}>(), {
  maxItems: Infinity,
  minItems: 0,
  labelFunction: (i: number) => `${i}`
})
const emit = defineEmits<{
  (e: 'swap', index: number, direction: number): void
  (e: 'remove', index: number): void
  (e: 'add', item?: Record<string, unknown>): void
}>()
</script>
