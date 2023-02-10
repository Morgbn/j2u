<template>
  <div>
    <div v-for="(option, index) in props.options" :key="index">
      <label :for="option + 'radio'" class="pure-radio">
        <input
          :id="option + 'radio'"
          type="radio"
          name="radio1"
          :checked="props.modelValue + '' === option"
          :value="option"
          @input="handleInput"
        >
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue?: string,
  options?: Array<any>
}>(), {
  modelValue: '',
  options: () => []
})
const emit = defineEmits<{(e: 'update:modelValue', value: string): void }>()

function handleInput (event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style>
.pure-radio {
  margin-left: 1px!important;
}
</style>
