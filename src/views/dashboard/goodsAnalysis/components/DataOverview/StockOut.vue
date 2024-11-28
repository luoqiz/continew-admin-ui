<template>
  <div>
    <PieCard :title="$t('page.home.data.todayStockOut')" :data="chartData" :loading="loading"></PieCard>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import PieCard from './PieCard/index.vue'
import { staticsStockOutToday } from '@/apis/wms/whseStockOut'

const whseId = inject<Ref<string>>('whseId')
const chartData = ref<{ name: string, value: any }[]>([])
const loading = ref(false)
const getTodayStockOut = async () => {
  loading.value = true
  chartData.value = []
  try {
    const res = await staticsStockOutToday(whseId!.value)
    for (const item of res.data) {
      chartData.value.push({ name: item.goodsName, value: item.realNum })
    }
  } finally {
    loading.value = false
  }
}

watch(whseId, () => {
  if (whseId?.value) {
    getTodayStockOut()
  }
}, { immediate: true })
</script>

<style scoped lang="less">

</style>
