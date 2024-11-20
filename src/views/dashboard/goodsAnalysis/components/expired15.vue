<script setup lang="ts">
import { reactive, ref } from 'vue'
import Expired from './Expired.vue'
import { staticsExpired } from '@/apis/wms/goodsStock'

const columns = ref([
  {
    title: 'goodsSku',
    dataIndex: 'goodsSku',
  },
  {
    title: 'goodsName',
    dataIndex: 'goodsName',
  },
  {
    title: 'realNum',
    dataIndex: 'realNum',
  },
])
const data = ref([])

const getExpiredGoods = async () => {
  const res = await staticsExpired('644614200840159246', 15)
  data.value = res.data
}

onMounted(() => {
  getExpiredGoods()
})
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
