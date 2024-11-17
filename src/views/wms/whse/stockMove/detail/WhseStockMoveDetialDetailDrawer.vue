<template>
  <a-drawer v-model:visible="visible" :title="$t('wms.whse.stock.move.detial.page.detail.title')" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.stockMoveNo')">{{ dataDetail?.stockMoveNo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.goodsStockId')">{{ dataDetail?.goodsStockId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.goodsSku')">{{ dataDetail?.goodsSku }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.goodsName')">{{ dataDetail?.goodsName }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.moveTime')">{{ dataDetail?.moveTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.prodTime')">{{ dataDetail?.prodTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.expiryTime')">{{ dataDetail?.expiryTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.planNum')">{{ dataDetail?.planNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.realNum')">{{ dataDetail?.realNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.memo')">{{ dataDetail?.memo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.createUser')">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.updateUser')">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.detial.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type WhseStockMoveDetialDetailResp, getWhseStockMoveDetail } from '@/apis/wms/whseStockMoveDetail'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<WhseStockMoveDetialDetailResp>()
const visible = ref(false)

// 查询详情
const getDataDetail = async () => {
  const { data } = await getWhseStockMoveDetail(dataId.value)
  dataDetail.value = data
}

// 打开
const onOpen = async (id: string) => {
  dataId.value = id
  await getDataDetail()
  visible.value = true
}

defineExpose({ onOpen })
</script>

<style lang="scss" scoped></style>
