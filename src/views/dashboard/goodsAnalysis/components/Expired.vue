<script setup lang="ts">
const { columns, data } = defineProps<{
  columns: []
  data: []
}>()
</script>

<template>
  <div class="">
    <a-table :columns="columns" :data="data" />
  </div>
</template>

<style lang="scss" scoped>

</style>
