<template>
  <a-drawer v-model:visible="visible" :title="$t('wms.whse.stock.move.page.detail.title')" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.name')">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockMoveNo')">{{ dataDetail?.stockMoveNo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockMoveType')">{{ dataDetail?.stockMoveType }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockInWhseId')">{{ dataDetail?.stockInWhseId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockInWhseAreaId')">{{ dataDetail?.stockInWhseAreaId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockOutWhseId')">{{ dataDetail?.stockOutWhseId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockOutWhseAreaId')">{{ dataDetail?.stockOutWhseAreaId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.moveTime')">{{ dataDetail?.moveTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.status')">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockInId')">{{ dataDetail?.stockInId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.stockOutId')">{{ dataDetail?.stockOutId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.memo')">{{ dataDetail?.memo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.createUser')">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.updateUser')">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.move.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type WhseStockMoveDetailResp, getWhseStockMove } from '@/apis/wms/whseStockMove'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<WhseStockMoveDetailResp>()
const visible = ref(false)

// 查询详情
const getDataDetail = async () => {
  const { data } = await getWhseStockMove(dataId.value)
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
