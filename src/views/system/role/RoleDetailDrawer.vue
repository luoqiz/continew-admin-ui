<template>
  <a-drawer v-model:visible="visible" :title="$t('sys.role.page.detail.title')" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :title="$t('sys.role.add.step1')" :column="2" size="large" class="general-description">
      <a-descriptions-item :label="$t('sys.role.field.id')">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.dataScope')">
        <GiCellTag :value="dataDetail?.dataScope" :dict="data_scope_enum" />
      </a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.name')">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.code')">{{ dataDetail?.code }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.createUser')">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.createTime')">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.updateUser')">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.updateTime')">{{ dataDetail?.updateTime }}</a-descriptions-item>
      <a-descriptions-item :label="$t('sys.role.field.description')" :span="2">{{ dataDetail?.description }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      :title="$t('sys.role.add.step2')"
      :column="2"
      size="large"
      class="permission general-description"
      style="margin-top: 20px; position: relative"
    >
      <a-descriptions-item :span="2">
        <a-tree
          :checked-keys="dataDetail?.menuIds"
          :data="menuList"
          default-expand-all
          check-strictly
          checkable
        />
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      v-if="dataDetail?.dataScope === 5"
      :title="$t('sys.role.add.step3')"
      :column="2"
      size="large"
      class="general-description"
      style="margin-top: 20px; position: relative"
    >
      <a-descriptions-item :span="2">
        <a-tree
          :checked-keys="dataDetail?.deptIds"
          :data="deptList"
          default-expand-all
          check-strictly
          checkable
        />
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type RoleDetailResp, getRole as getDetail } from '@/apis/system/role'
import { useDept, useDict, useMenu } from '@/hooks/app'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<RoleDetailResp>()
const visible = ref(false)
const { data_scope_enum } = useDict('data_scope_enum')
const { deptList, getDeptList } = useDept()
const { menuList, getMenuList } = useMenu()

// 查询详情
const getDataDetail = async () => {
  const { data } = await getDetail(dataId.value)
  dataDetail.value = data
}

// 打开
const onOpen = async (id: string) => {
  dataId.value = id
  if (!menuList.value.length) {
    await getMenuList()
  }
  if (!deptList.value.length) {
    await getDeptList()
  }
  await getDataDetail()
  visible.value = true
}

defineExpose({ onOpen })
</script>

<style scoped lang="scss">
.permission :deep(.arco-descriptions-item-label-block) {
  padding-right: 0;
}
</style>
