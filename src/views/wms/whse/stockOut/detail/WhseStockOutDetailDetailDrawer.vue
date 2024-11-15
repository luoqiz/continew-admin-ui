<template>
  <a-drawer v-model:visible="visible" :title="$t('wms.whse.stock.out.detail.page.detail.title')" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.stockOutId')">{{ dataDetail?.stockOutId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.goodsSku')">{{ dataDetail?.goodsSku }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.goodsName')">{{ dataDetail?.goodsName }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.prodTime')">{{ dataDetail?.prodTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.expiryTime')">{{ dataDetail?.expiryTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.planNum')">{{ dataDetail?.planNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.realNum')">{{ dataDetail?.realNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.memo')">{{ dataDetail?.memo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.status')">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.createUser')">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <!-- <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item> -->
      <!-- <a-descriptions-item :label="$t('page.common.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.whse.stock.out.detail.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item> -->
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { type WhseStockOutDetailDetailResp, getWhseStockOutDetail } from '@/apis/wms/whseStockOutDetail'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<WhseStockOutDetailDetailResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getWhseStockOutDetail(dataId.value)
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
