<template>
  <div class="form-array">
    <template v-for="(item, i) in props.array" :key="i">
      ðï¸{{ i }}
      <template v-if="!readOnly">
        <button v-if="i" @click.prevent="emit('swap', i, -1)">
          ð¼
        </button>
        <button v-if="i < props.array.length - 1" @click.prevent="emit('swap', i, 1)">
          ð½
        </button>
        <button style="float: right" @click.prevent="emit('remove', i)">
          ðï¸
        </button>
      </template>
      <slot :item="item" :index="i" />
      <br>
    </template>
    <button v-if="!readOnly" @click.prevent="emit('add')">
      âAdd
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  array: Array<any>
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'swap', index: number, direction: number): void
  (e: 'remove', index: number): void
  (e: 'add'): void
}>()
</script>
