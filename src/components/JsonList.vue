<template>
  <div class="json-list">
    <slot name="header" v-bind="slotScope">
      <header style="display: flex; margin-bottom: 12px;">
        <input
          v-model="search"
          :placeholder="i18n.search"
          type="text"
        >
        <select v-model="sortBy">
          <option value="">
            {{ i18n.sortBy }}
          </option>
          <option v-for="key in keys" :key="key.value" :value="key.value">
            {{ key.title }}
          </option>
        </select>
        <div class="btn-group">
          <button :aria-label="i18n.sortDescending" @click="sortDesc = true">
            ↑
          </button>
          <button :aria-label="i18n.sortAscending" @click="sortDesc = false">
            ↓
          </button>
          <button @click="exportAsCsv">
            ↗ {{ i18n.exportAsCsv }}
          </button>
          <button :aria-label="i18n['toggleView'+view[0].toUpperCase()+view.slice(1)]" @click="view = view == 'card' ? 'list' : 'card'">
            {{ view == 'card' ? '⊞' : '⊟' }}
          </button>
        </div>
      </header>
    </slot>

    <slot v-if="view === 'list'" name="table-header" v-bind="slotScope">
      <article :style="{ display: 'grid', gridTemplateColumns: `repeat(${keys.length}, minmax(0,1fr))`,gap: '20px', userSelect: 'none' }">
        <span v-for="key in keys" :key="key.value" :style="{ color: key.value === sortBy ? 'var(--color-sort-by)' : '' }" @click="sortBy == key.value ? (sortDesc ? sortDesc = false : sortBy = '') : (sortBy = key.value) && (sortDesc = true)">
          {{ key.value === sortBy ? (sortDesc ? '↑' : '↓') : '' }}
          {{ key.title }}
        </span>
      </article>
    </slot>

    <slot v-bind="slotScope">
      <div :style="view == 'card' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' } : {}">
        <slot v-for="item in items" name="item" v-bind="slotScope" :item="item">
          <article
            :key="item[props.itemKey]"
            :style="view === 'card' ? {} : { display: 'grid', gridTemplateColumns: `repeat(${keys.length}, minmax(0,1fr))`, gap: '20px' }"
          >
            <p v-for="key in keys" :key="key.value" :style="{ color: key.value === sortBy ? 'var(--color-sort-by)' : '' }">
              <span v-if="view === 'card'">{{ key.title + i18n[':'] }}</span>
              <span>{{ item[key.value] || '' }}</span>
            </p>
          </article>
        </slot>
      </div>
    </slot>
    <slot name="footer" v-bind="slotScope">
      <footer style="display: flex; justify-content: space-between; user-select: none;">
        <p>
          <span>{{ i18n.itemsPerPage }}</span>&nbsp;
          <input v-model.number="itemsPerPage" type="number" min="2" step="2" style="width: 40px;">
        </p>
        <p>
          <span>{{ i18n.page(page, nPages) }}</span>&nbsp;
          <button :disabled="page == 1" :aria-label="i18n.prevPage" @click="page--">
            &lt;
          </button>&nbsp;
          <button :disabled="page == nPages" :aria-label="i18n.nextPage" @click="page++">
            >
          </button>
        </p>
      </footer>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocalProp } from '@/utils/localProp'
import { downloadBlob, arrayToCsv } from '@/utils/blob'
import type { IAnyObject, ISchemaObject } from '@/types'

type ISortFunc = (a: IAnyObject, b: IAnyObject) => number

const props = withDefaults(defineProps<{
  schema: ISchemaObject
  items: IAnyObject[]
  itemKey?: string
  itemsPerPage?: number
  page?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  view?: 'card'|'list'
  sortFunctions?: { [key: string]: ISortFunc }
  i18n?: IAnyObject
}>(), {
  itemKey: 'id',
  itemsPerPage: 12,
  page: 1,
  view: 'card',
  sortFunctions: () => ({}),
  i18n: () => ({})
})

const page = useLocalProp<number>('page', props)
const search = useLocalProp<string>('search', props)
const sortBy = useLocalProp<string>('sortBy', props)
const sortDesc = useLocalProp<boolean>('sortDesc', props)
const itemsPerPage = useLocalProp<number>('itemsPerPage', props)
const view = useLocalProp<string>('view', props)

const i18n = computed(() => ({
  // default values:
  ':': ': ',
  noData: 'No data',
  noResults: 'No results',
  search: 'Search',
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
  sortBy: 'Sort by',
  itemsPerPage: 'Items per page:',
  page: (current: number, total: number) => `Page ${current} of ${total}`,
  exportAsCsv: '.csv',
  csvFilename: 'data.csv',
  nextPage: 'Next page',
  prevPage: 'Previous page',
  toggleViewList: 'View items in card mode',
  toggleViewCard: 'View items in row mode',
  // user values from prop:
  ...props.i18n
}))

const searchedItems = computed(() => {
  if (!search.value) { return props.items }
  const txt = search.value.toLocaleLowerCase()
  return props.items
    .filter(item => Object.values(item)
      .find(v => JSON.stringify(v).toLocaleLowerCase().includes(txt)))
})

const sorters: { [key: string]: (attr: string) => ISortFunc } = {
  string: (attr: string) => (a: IAnyObject, b: IAnyObject) => (a[attr] ?? '').localeCompare(b[attr] ?? ''),
  number: (attr: string) => (a: IAnyObject, b: IAnyObject) => a[attr] - b[attr],
  integer: (attr: string) => (a: IAnyObject, b: IAnyObject) => a[attr] - b[attr],
  boolean: (attr: string) => (a: IAnyObject) => a[attr] ? 1 : -1,
  array: (attr: string) => (a: IAnyObject, b: IAnyObject) => a[attr].length - b[attr].length
}
const sortedItems = computed(() => { // sortedItems
  const items = [...searchedItems.value]
  if (!sortBy.value) { return items }
  let sortFunc = props.sortFunctions[sortBy.value]
  if (!sortFunc) {
    const model = props.schema.properties[sortBy.value]
    if (typeof model !== 'boolean') {
      const type = Array.isArray(model.type) ? model.type[0] : (model.type ?? '')
      sortFunc = sorters[type]?.(sortBy.value)
    }
  }
  return sortFunc ? items.sort(sortFunc) : items
})

const reorderedItems = computed(() => sortDesc.value ? sortedItems.value : [...sortedItems.value].reverse())

const nPages = computed(() => Math.ceil(searchedItems.value.length / itemsPerPage.value))

const items = computed(() => { // onPageItems
  const from = (page.value - 1) * itemsPerPage.value
  const to = from + itemsPerPage.value
  return reorderedItems.value.slice(from, to)
})

const keys = computed(() => {
  const keys = []
  for (const [value, o] of Object.entries(props.schema.properties)) {
    if (typeof o !== 'object') { continue }
    keys.push({ value, title: o.title ?? value })
  }
  return keys
})

const slotScope = computed(() => ({
  page: page.value,
  search: search.value,
  sortBy: sortBy.value,
  sortDesc: sortDesc.value,
  itemsPerPage: itemsPerPage.value,
  view: view.value,
  i18n: i18n.value,
  nPages: nPages.value,
  items: items.value,
  keys: keys.value,
  exportAsCsv
}))

const exportAsCsv = () => {
  const arr = [keys.value.map(k => k.title)]
  const attrs = keys.value.map(k => k.value)
  for (const item of searchedItems.value) {
    arr.push(attrs.map(attr => item[attr]))
  }
  const csv = arrayToCsv(arr)
  downloadBlob(csv, i18n.value.csvFilename, 'text/csv;charset=utf-8;')
}
</script>
