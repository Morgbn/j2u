<template>
  <vue-date-picker
    v-model="date"
    :readonly="readOnly"
    :disabled="readOnly"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps<{
  modelValue?: string
  readOnly?: boolean
}>()
const emit = defineEmits<{(e: 'update:modelValue', value: string): void }>()

const date = computed({
  get () : Date {
    return new Date(props.modelValue)
  },
  set (val) {
    emit('update:modelValue', val?.toISOString().slice(0, 10))
  }
})
</script>

<style>
.custom-wrapper .content input.dp__input_icon_pad {
  padding-left: 35px;
}
</style>
