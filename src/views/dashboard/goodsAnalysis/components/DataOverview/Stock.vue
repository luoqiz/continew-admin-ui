<template>
  <div>
    <PieCard title="库存剩余" :data="chartData" :loading="loading"></PieCard>
  </div>
</template>

<script setup lang="ts">
import PieCard from './PieCard/index.vue'
import { staticsStock, staticsStockInToday } from '@/apis/wms/goodsStock'

const chartData = ref([])
const loading = ref(false)
const getTodayStockIn = async () => {
  loading.value = true
  try {
    const res = await staticsStock('644614200840159246')
    for (const item of res.data) {
      chartData.value.push({ name: item.goodsName, value: item.realNum })
    }
  } catch (_err) {

  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTodayStockIn()
})
</script>

<style scoped lang="less">

</style>
