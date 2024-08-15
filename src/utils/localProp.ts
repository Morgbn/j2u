import { ref, computed, watch, getCurrentInstance } from 'vue'
import type { WritableComputedRef, ComponentInternalInstance } from 'vue'
import type { IAnyObject } from '@/types'

export function useLocalProp<T>(
  name: string,
  props: IAnyObject,
  emit?: ComponentInternalInstance['emit']
) {
  const local = ref<T | null>(null)
  const eventName = `update:${name}`
  const $emit = emit ?? getCurrentInstance()?.emit ?? (() => {})
  watch(() => props[name], v => (local.value = v), { immediate: true })
  return computed({
    get: () => local.value,
    set: v => $emit(eventName, (local.value = v))
  }) as WritableComputedRef<T>
}
