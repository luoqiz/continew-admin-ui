<template>
  <div>
    <PieCard title="今日出库" :data="chartData" :loading="loading"></PieCard>
  </div>
</template>

<script setup lang="ts">
import PieCard from './PieCard/index.vue'
import { staticsStockOutToday } from '@/apis/wms/whseStockOut'

const chartData = ref([])
const loading = ref(false)
const getTodayStockOut = async () => {
  loading.value = true
  try {
    const res = await staticsStockOutToday('644614200840159246')
    for (const item of res.data) {
      chartData.value.push({ name: item.goodsName, value: item.realNum })
    }
  } catch (_err) {

  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTodayStockOut()
})
</script>

<style scoped lang="less">

</style>
