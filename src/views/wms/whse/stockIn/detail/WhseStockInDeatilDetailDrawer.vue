<template>
  <a-drawer v-model:visible="visible" title="仓库入库明细详情" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="id编号">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="入库id编号">{{ dataDetail?.stockInId }}</a-descriptions-item>
      <a-descriptions-item label="商品sku">{{ dataDetail?.goodsSku }}</a-descriptions-item>
      <a-descriptions-item label="商品名称">{{ dataDetail?.goodsName }}</a-descriptions-item>
      <a-descriptions-item label="生产日期">{{ dataDetail?.prodTime }}</a-descriptions-item>
      <a-descriptions-item label="过期日期">{{ dataDetail?.expiryTime }}</a-descriptions-item>
      <a-descriptions-item label="计划入库数量">{{ dataDetail?.planNum }}</a-descriptions-item>
      <a-descriptions-item label="实际入库数量">{{ dataDetail?.realNum }}</a-descriptions-item>
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
import { type WhseStockInDetailDetailResp, getWhseStockInDetail } from '@/apis/wms/whseStockInDetail'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<WhseStockInDetailDetailResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getWhseStockInDetail(dataId.value)
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
