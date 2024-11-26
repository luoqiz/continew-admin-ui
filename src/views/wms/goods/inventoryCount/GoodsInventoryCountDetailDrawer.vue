<template>
  <a-drawer v-model:visible="visible" :title="$t('wms.goods.inventory.count.page.detail.title')" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.name')">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.whseId')">{{ dataDetail?.whseId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.whseAreaId')">{{ dataDetail?.whseAreaId }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.status')">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.startTime')">{{ dataDetail?.startTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.endTime')">{{ dataDetail?.endTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.memo')">{{ dataDetail?.memo }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.createUser')">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.updateUser')">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item :label="$t('page.common.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('wms.goods.inventory.count.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { type GoodsInventoryCountDetailResp, getGoodsInventoryCount as getDetail } from '@/apis/wms/goodsInventoryCount'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<GoodsInventoryCountDetailResp>()
const visible = ref(false)

const { t } = useI18n()

// 状态枚举
const status_enum = computed(() => [{
  value: 1,
  label: t('wms.goods.inventory.count.status.s1'),
  other: 'extra',
}, {
  value: 2,
  label: t('wms.goods.inventory.count.status.s2'),
  other: 'extra',
}, {
  value: 3,
  label: t('wms.goods.inventory.count.status.s3'),
  other: 'extra',
}])

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
