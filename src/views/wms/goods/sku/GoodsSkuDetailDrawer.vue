<template>
  <a-drawer v-model:visible="visible" title="商品规格(sku)详情" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="编号">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="条形码">{{ dataDetail?.barcode }}</a-descriptions-item>
      <a-descriptions-item label="商品编号">{{ dataDetail?.spuId }}</a-descriptions-item>
      <a-descriptions-item label="规格名称">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item label="单位">{{ dataDetail?.unit }}</a-descriptions-item>
      <a-descriptions-item label="数量">{{ dataDetail?.amount }}</a-descriptions-item>
      <a-descriptions-item label="拆箱">{{ dataDetail?.unpacking }}</a-descriptions-item>
      <a-descriptions-item label="拆箱单位">{{ dataDetail?.packUnit }}</a-descriptions-item>
      <a-descriptions-item label="拆箱数量">{{ dataDetail?.packAmount }}</a-descriptions-item>
      <a-descriptions-item label="卖点">{{ dataDetail?.sellPoint }}</a-descriptions-item>
      <a-descriptions-item label="规格列表">{{ dataDetail?.specs }}</a-descriptions-item>
      <a-descriptions-item label="售价">{{ dataDetail?.price }}</a-descriptions-item>
      <a-descriptions-item label="首图">{{ dataDetail?.img }}</a-descriptions-item>
      <a-descriptions-item label="图片列表">{{ dataDetail?.pics }}</a-descriptions-item>
      <a-descriptions-item label="状态 1上架  2下架">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item label="备注信息">{{ dataDetail?.memo }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { type GoodsSkuDetailResp, getGoodsSku } from '@/apis/wms/goodsSku'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<GoodsSkuDetailResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getGoodsSku(dataId.value)
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
