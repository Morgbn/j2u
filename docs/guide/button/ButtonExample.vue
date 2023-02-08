<template>
  <div style="margin-bottom: 16px">
    <MyButton label="Default" />
  </div>
  <div style="margin-bottom: 16px">
    <MyButton primary />
  </div>
  <div style="margin-bottom: 16px">
    <MyButton2 label="Text" type="text" />
  </div>
</template>

<script setup>
import { MyButton, MyButton2 } from '../../../src/components'
</script>
