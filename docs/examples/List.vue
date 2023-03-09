<template>
  <div class="list-example">
    <JsonList :items="items" :schema="schema" />
  </div>
</template>

<script setup>
import items from './list.json'
import JsonList from '@/components/JsonList.vue'

const schema = {
  type: 'object',
  properties: {
    first_name: {
      type: 'string',
      title: 'First name',
      minLength: 2
    },
    last_name: {
      type: 'string',
      title: 'Last name',
      minLength: 2
    },
    email: {
      type: 'string',
      title: 'Email'
    },
    fav_color: {
      type: 'string',
      title: 'Favorite color',
      enum: ['Aquamarine', 'Crimson', 'Fuscia', 'Green', 'Indigo', 'Maroon', 'Mauv', 'Orange', 'Pink', 'Puce', 'Purple', 'Red', 'Teal', 'Turquoise', 'Violet', 'Yellow']
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 12,
      maximum: 130
    }
  },
  required: ['first_name', 'last_name', 'email']
}
</script>

<style>
.list-example {
  --color-sort-by: var(--vp-c-brand);
}
.list-example select, .list-example input, .list-example button, .list-example article {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}
.list-example article {
  margin-bottom: 12px;
}
</style>
