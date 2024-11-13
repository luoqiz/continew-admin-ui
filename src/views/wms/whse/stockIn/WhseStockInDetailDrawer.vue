<template>
  <a-drawer v-model:visible="visible" title="仓库入库详情" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="id编号">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="入库名称">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item label="入库单号">{{ dataDetail?.stockInNo }}</a-descriptions-item>
      <a-descriptions-item label="入库类型(1 采购入库)">{{ dataDetail?.stockInType }}</a-descriptions-item>
      <a-descriptions-item label="仓库id编号">{{ dataDetail?.whseId }}</a-descriptions-item>
      <a-descriptions-item label="仓库区域id编号">{{ dataDetail?.whseAreaId }}</a-descriptions-item>
      <a-descriptions-item label="关联移库单号">{{ dataDetail?.stockMoveId }}</a-descriptions-item>
      <a-descriptions-item label="入库时间">{{ dataDetail?.inTime }}</a-descriptions-item>
      <a-descriptions-item label="状态 (1审核中 2待入库 3已完成)">{{ dataDetail?.status }}</a-descriptions-item>
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
import { type WhseStockInInfoResp, getWhseStockIn } from '@/apis/wms/whseStockIn'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<WhseStockInInfoResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getWhseStockIn(dataId.value)
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
