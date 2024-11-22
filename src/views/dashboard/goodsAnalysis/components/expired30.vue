<script setup lang="ts">
import { reactive, ref } from 'vue'
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

const getExpiredGoods = async () => {
  const res = await staticsExpired('644614200840159246', 30)
  data.value = res.data
}

onMounted(() => {
  getExpiredGoods()
})
</script>

<template>
  <div class="">
    <a-card title="30天内临期">
      <Expired :columns="columns" :data="data"></Expired>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
