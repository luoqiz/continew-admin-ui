<template>
  <div>
    <PieCard :title="$t('page.home.data.todayStockIn')" :data="chartData" :loading="loading"></PieCard>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import PieCard from './PieCard/index.vue'
import { staticsStockInToday } from '@/apis/wms/goodsStock'

const whseId = inject<Ref<string>>('whseId')
const chartData = ref<{ name: string, value: any }[]>([])
const loading = ref(false)
const getTodayStockIn = async () => {
  loading.value = true
  try {
    const res = await staticsStockInToday(whseId!.value)
    for (const item of res.data) {
      chartData.value.push({ name: item.goodsName, value: item.realNum })
    }
  } finally {
    loading.value = false
  }
}

watch(whseId, () => {
  if (whseId?.value) {
    getTodayStockIn()
  }
}, { immediate: true })
</script>

<style scoped lang="less">

</style>
