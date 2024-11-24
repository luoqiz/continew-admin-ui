<template>
  <a-card class="general-card" title="数据总览">
    <a-grid :cols="24" :col-gap="12" :row-gap="12">
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }">
        <StockOut />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 }">
        <StockIn />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }">
        <Stock />
      </a-grid-item>
    </a-grid>
    <template #extra>
      <slot name="extra"></slot>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import Stock from './Stock.vue'
import StockOut from './StockOut.vue'
import StockIn from './StockIn.vue'
</script>

<style scoped lang="less"></style>
