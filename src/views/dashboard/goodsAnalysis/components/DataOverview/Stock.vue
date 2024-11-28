<template>
  <div>
    <PieCard :title="$t('page.home.data.todayStockNum')" :data="chartData" :loading="loading"></PieCard>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import PieCard from './PieCard/index.vue'
import { staticsStock } from '@/apis/wms/goodsStock'

const whseId = inject<Ref<string>>('whseId')
const chartData = ref<{ name: string, value: any }[]>([])

const loading = ref(false)
const getTodayStockIn = async () => {
  loading.value = true
  chartData.value = []
  try {
    const res = await staticsStock(whseId!.value)
    for (const item of res.data) {
      chartData.value.push({ name: item.goodsName, value: item.realNum })
    }
  } finally {
    loading.value = false
  }
}

watch(whseId, async () => {
  if (!!whseId && whseId!.value) {
    await getTodayStockIn()
  }
}, { immediate: true })
</script>

<style scoped lang="less">

</style>
