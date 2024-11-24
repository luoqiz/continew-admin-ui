<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import Expired from './Expired.vue'
import { staticsExpired } from '@/apis/wms/goodsStock'

const columns = ref([
  {
    title: '物料条码',
    dataIndex: 'goodsSku',
  },
  {
    title: '物料名称',
    dataIndex: 'goodsName',
  },
  {
    title: '数量',
    dataIndex: 'realNum',
  },
])
const data = ref([])

const whseId = inject<Ref<string>>('whseId')
const getExpiredGoods = async () => {
  if (whseId) {
    const res = await staticsExpired(whseId!.value, 15)
    data.value = res.data
  }
}

watch(whseId, () => {
  if (whseId?.value) {
    getExpiredGoods()
  }
}, { immediate: true })
</script>

<template>
  <div class="">
    <a-card title="15天内临期">
      <Expired :columns="columns" :data="data"></Expired>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
