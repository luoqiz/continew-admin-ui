<template>
  <a-drawer v-model:visible="visible" :title="$t('sys.user.page.detail.title')" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('sys.user.field.id')" :span="2">
        <a-typography-paragraph copyable>{{ dataDetail?.id }}</a-typography-paragraph>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.username')">{{ dataDetail?.username }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.nickname')">{{ dataDetail?.nickname }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.gender')">
        <span v-if="dataDetail?.gender === 1">{{ $t('page.common.tips.sex.man') }}</span>
        <span v-else-if="dataDetail?.gender === 2">{{ $t('page.common.tips.sex.woman') }}</span>
        <span v-else>{{ $t('page.common.tips.sex.unknow') }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.status')">
        <a-tag v-if="dataDetail?.status === 1" color="green">{{ $t('page.common.tips.enable') }}</a-tag>
        <a-tag v-else color="red">{{ $t('page.common.tips.disable') }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.phone')">{{ dataDetail?.phone || '暂无' }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.email')">{{ dataDetail?.email || '暂无' }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.deptName')">{{ dataDetail?.deptName }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.role')"><GiCellTags :data="dataDetail?.roleNames" /></a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.user.field.description')" :span="2">{{ dataDetail?.description }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type UserDetailResp, getUser as getDetail } from '@/apis/system/user'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<UserDetailResp>()
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
