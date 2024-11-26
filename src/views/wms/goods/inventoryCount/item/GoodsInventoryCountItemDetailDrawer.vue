<template>
  <a-drawer v-model:visible="visible" :title="$t('wms.goods.inventory.count.item.page.detail.title')" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.inventoryCountId')">{{ dataDetail?.inventoryCountId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.stockId')">{{ dataDetail?.stockId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.goodsId')">{{ dataDetail?.goodsId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.goodsSku')">{{ dataDetail?.goodsSku }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.initNum')">{{ dataDetail?.initNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.realNum')">{{ dataDetail?.realNum }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.status')">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.prodTime')">{{ dataDetail?.prodTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.expiryTime')">{{ dataDetail?.expiryTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.memo')">{{ dataDetail?.memo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.createUser')">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.updateUser')">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.item.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type GoodsInventoryCountItemDetailResp, getGoodsInventoryCountItem as getDetail } from '@/apis/wms/goodsInventoryCountItem'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<GoodsInventoryCountItemDetailResp>()
const visible = ref(false)

// 查询详情
const getDataDetail = async () => {
  const { data } = await getDetail(dataId.value)
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

<style scoped lang="scss"></style>
