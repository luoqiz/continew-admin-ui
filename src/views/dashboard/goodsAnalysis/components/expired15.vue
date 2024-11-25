<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Expired from './Expired.vue'
import { staticsExpired } from '@/apis/wms/goodsStock'

const { t } = useI18n()

const columns = computed(() => {
  return [
    {
      title: t('page.home.data.table.goods.barcode'),
      dataIndex: 'goodsSku',
    },
    {
      title: t('page.home.data.table.goods.name'),
      dataIndex: 'goodsName',
    },
    {
      title: t('page.home.data.table.goods.num'),
      dataIndex: 'realNum',
    },
  ]
})
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
    <a-card :title="$t('page.home.data.expired.15day')">
      <Expired :columns="columns" :data="data"></Expired>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
