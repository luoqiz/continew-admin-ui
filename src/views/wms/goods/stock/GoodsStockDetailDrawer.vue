<template>
  <a-drawer v-model:visible="visible" :title="$t('wms.goods.stock.page.detail.title')" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('wms.goods.stock.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.stockInId')">{{ dataDetail?.stockInId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.stockInNo')">{{ dataDetail?.stockInNo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.stockInDetailId')">{{ dataDetail?.stockInDetailId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.goodsId')">{{ dataDetail?.goodsId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.goodsSku')">{{ dataDetail?.goodsSku }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.initNum')">{{ dataDetail?.initNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.realNum')">{{ dataDetail?.realNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.whseType')">{{ dataDetail?.whseType }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.whseId')">{{ dataDetail?.whseId }}</a-descriptions-item>
      <!-- <a-descriptions-item :label="$t('wms.goods.stock.field.whseAreaId')">{{ dataDetail?.whseAreaId }}</a-descriptions-item> -->
      <a-descriptions-item :label="$t('wms.goods.stock.field.status')">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.prodTime')">{{ dataDetail?.prodTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.expiryTime')">{{ dataDetail?.expiryTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.info')">{{ dataDetail?.info }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.createUser')">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.updateUser')">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.stock.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { type GoodsStockDetailResp, getGoodsStock } from '@/apis/wms/goodsStock'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<GoodsStockDetailResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getGoodsStock(dataId.value)
  dataDetail.value = res.data
}

// 打开详情
const onDetail = async (id: string) => {
  dataId.value = id
  await getDataDetail()
  visible.value = true
}

defineExpose({ onDetail })
</script>

<style lang="scss" scoped></style>
