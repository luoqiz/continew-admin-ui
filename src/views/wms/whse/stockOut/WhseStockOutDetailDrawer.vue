<template>
  <a-drawer v-model:visible="visible" :title="$t('wms.whse.stock.out.page.detail.title')" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.name')">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.stockOutNo')">{{ dataDetail?.stockOutNo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.stockOutType')">{{ dataDetail?.stockOutType }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.whseId')">{{ dataDetail?.whseId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.whseAreaId')">{{ dataDetail?.whseAreaId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.stockMoveId')">{{ dataDetail?.stockMoveId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.outTime')">{{ dataDetail?.outTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.status')">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.createUser')">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.updateUser')">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { type WhseStockOutInfoResp, getWhseStockOut } from '@/apis/wms/whseStockOut'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<WhseStockOutInfoResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getWhseStockOut(dataId.value)
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
