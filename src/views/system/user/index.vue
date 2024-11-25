<template>
  <div class="table-page">
    <a-row justify="space-between" align="center" class="header page_header">
      <a-space wrap>
        <div class="title">{{ $t('menu.system.user') }}</div>
      </a-space>
    </a-row>
    <a-row align="stretch" :gutter="14" class="h-full page_content">
      <a-col :xs="0" :sm="0" :md="6" :lg="5" :xl="5" :xxl="4" class="h-full ov-hidden">
        <DeptTree @node-click="handleSelectDept" />
      </a-col>
      <a-col :xs="24" :sm="24" :md="18" :lg="19" :xl="19" :xxl="20" class="h-full ov-hidden">
        <GiTable
          row-key="id"
          :data="dataList"
          :columns="columns"
          :loading="loading"
          :scroll="{ x: '100%', y: '100%', minWidth: 1500 }"
          :pagination="pagination"
          :disabled-tools="['size']"
          :disabled-column-keys="['nickname']"
          @refresh="search"
        >
          <template #top>
            <GiForm v-model="queryForm" :options="options" :columns="queryFormColumns" @search="search" @reset="reset"></GiForm>
          </template>
          <template #toolbar-left>
            <a-button v-permission="['system:user:add']" type="primary" @click="onAdd">
              <template #icon><icon-plus /></template>
              <template #default>{{ $t('page.common.button.add') }}</template>
            </a-button>
            <a-button v-permission="['system:user:import']" @click="onImport">
              <template #icon><icon-upload /></template>
              <template #default>{{ $t('page.common.button.import') }}</template>
            </a-button>
          </template>
          <template #toolbar-right>
            <a-button v-permission="['system:user:export']" @click="onExport">
              <template #icon><icon-download /></template>
              <template #default>{{ $t('page.common.button.export') }}</template>
            </a-button>
          </template>
          <template #nickname="{ record }">
            <GiCellAvatar :avatar="record.avatar" :name="record.nickname" />
          </template>
          <template #gender="{ record }">
            <GiCellGender :gender="record.gender" />
          </template>
          <template #roleNames="{ record }">
            <GiCellTags :data="record.roleNames" />
          </template>
          <template #status="{ record }">
            <GiCellStatus :status="record.status" />
          </template>
          <template #isSystem="{ record }">
            <a-tag v-if="record.isSystem" color="red" size="small">{{ $t('page.common.field.true') }}</a-tag>
            <a-tag v-else color="arcoblue" size="small">{{ $t('page.common.field.false') }}</a-tag>
          </template>
          <template #action="{ record }">
            <a-space>
              <a-link v-permission="['system:user:detail']" :title="$t('page.common.button.detail')" @click="onDetail(record)">{{ $t('page.common.button.detail') }}</a-link>
              <a-link v-permission="['system:user:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
              <a-link
                v-permission="['system:user:delete']"
                status="danger"
                :disabled="record.isSystem"
                :title="record.isSystem ? $t('page.common.tips.data.notDelete') : $t('page.common.button.delete')"
                @click="onDelete(record)"
              >
                {{ $t('page.common.button.delete') }}
              </a-link>
              <a-dropdown>
                <a-button v-if="has.hasPermOr(['system:user:resetPwd', 'system:user:updateRole'])" type="text" size="mini" title="更多">
                  <template #icon>
                    <icon-more :size="16" />
                  </template>
                </a-button>
                <template #content>
                  <a-doption v-permission="['system:user:resetPwd']" :title="$t('page.common.button.resetPwd')" @click="onResetPwd(record)"> {{ $t('page.common.button.resetPwd') }}</a-doption>
                  <a-doption v-permission="['system:user:updateRole']" :title="$t('system.button.roleAssignment')" @click="onUpdateRole(record)"> {{ $t('system.button.roleAssignment') }}</a-doption>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </GiTable>
      </a-col>
    </a-row>

    <UserAddDrawer ref="UserAddDrawerRef" @save-success="search" />
    <UserImportDrawer ref="UserImportDrawerRef" @save-success="search" />
    <UserDetailDrawer ref="UserDetailDrawerRef" />
    <UserResetPwdModal ref="UserResetPwdModalRef" />
    <UserUpdateRoleModal ref="UserUpdateRoleModalRef" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DeptTree from './dept/index.vue'
import UserAddDrawer from './UserAddDrawer.vue'
import UserImportDrawer from './UserImportDrawer.vue'
import UserDetailDrawer from './UserDetailDrawer.vue'
import UserResetPwdModal from './UserResetPwdModal.vue'
import UserUpdateRoleModal from './UserUpdateRoleModal.vue'
import { type UserResp, deleteUser, exportUser, listUser } from '@/apis/system/user'
import type { Columns, Options } from '@/components/GiForm'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { DisEnableStatusList } from '@/constant/common'
import { useDownload, useForm, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'SystemUser' })

const { t } = useI18n()

const options: Options = reactive({
  form: { layout: 'inline' },
  grid: { cols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 } },
  fold: { enable: true, index: 1, defaultCollapsed: true },
})
const { form: queryForm, resetForm } = useForm({
  sort: ['t1.id,desc'],
})
const queryFormColumns: ComputedRef<Columns> = computed(() => [
  {
    type: 'input',
    field: 'description',
    formItemProps: {
      hideLabel: true,
    },
    props: {
      placeholder: t('sys.user.search.form.user'),
    },
  },
  {
    type: 'select',
    field: 'status',
    options: DisEnableStatusList,
    formItemProps: {
      hideLabel: true,
    },
    props: {
      placeholder: t('sys.user.search.form.status'),
    },
  },
  {
    type: 'range-picker',
    field: 'createTime',
    span: { lg: 2, xl: 2, xxl: 1 },
    formItemProps: {
      hideLabel: true,
    },
  },
])

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listUser({ ...queryForm, ...page }), { immediate: false })
const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  {
    title: t('page.common.field.sn'),
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize),
    fixed: !isMobile() ? 'left' : undefined,
  },
  {
    title: t('sys.user.field.nickname'),
    dataIndex: 'nickname',
    slotName: 'nickname',
    minWidth: 140,
    ellipsis: true,
    tooltip: true,
    fixed: !isMobile() ? 'left' : undefined,
  },
  { title: t('sys.user.field.username'), dataIndex: 'username', slotName: 'username', minWidth: 140, ellipsis: true, tooltip: true },
  { title: t('sys.user.field.status'), dataIndex: 'status', slotName: 'status', align: 'center' },
  { title: t('sys.user.field.gender'), dataIndex: 'gender', slotName: 'gender', align: 'center' },
  { title: t('sys.user.field.deptId'), dataIndex: 'deptName', minWidth: 180, ellipsis: true, tooltip: true },
  { title: t('sys.user.field.role'), dataIndex: 'roleNames', slotName: 'roleNames', minWidth: 165 },
  { title: t('sys.user.field.phone'), dataIndex: 'phone', minWidth: 170, ellipsis: true, tooltip: true },
  { title: t('sys.user.field.email'), dataIndex: 'email', minWidth: 170, ellipsis: true, tooltip: true },
  { title: t('sys.user.field.isSystem'), dataIndex: 'isSystem', slotName: 'isSystem', width: 100, align: 'center', show: false },
  { title: t('sys.user.field.description'), dataIndex: 'description', minWidth: 130, ellipsis: true, tooltip: true },
  { title: t('sys.user.field.createUser'), dataIndex: 'createUserString', width: 140, ellipsis: true, tooltip: true, show: false },
  { title: t('sys.user.field.createTime'), dataIndex: 'createTime', width: 180 },
  { title: t('sys.user.field.updateUser'), dataIndex: 'updateUserString', width: 140, ellipsis: true, tooltip: true, show: false },
  { title: t('sys.user.field.updateTime'), dataIndex: 'updateTime', width: 180, show: false },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 190,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr([
      'system:user:detail',
      'system:user:update',
      'system:user:delete',
      'system:user:resetPwd',
      'system:user:updateRole',
    ]),
  },
])

// 重置
const reset = () => {
  resetForm()
  search()
}

// 删除
const onDelete = (record: UserResp) => {
  return handleDelete(() => deleteUser(record.id), {
    content: `${t('sys.user.tips.delete')}「${record.nickname}(${record.username})」？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportUser(queryForm))
}

// 根据选中部门查询
const handleSelectDept = (keys: Array<any>) => {
  queryForm.deptId = keys.length === 1 ? keys[0] : undefined
  search()
}

const UserImportDrawerRef = ref<InstanceType<typeof UserImportDrawer>>()
// 导入
const onImport = () => {
  UserImportDrawerRef.value?.onOpen()
}

const UserAddDrawerRef = ref<InstanceType<typeof UserAddDrawer>>()
// 新增
const onAdd = () => {
  UserAddDrawerRef.value?.onAdd()
}

// 修改
const onUpdate = (record: UserResp) => {
  UserAddDrawerRef.value?.onUpdate(record.id)
}

const UserDetailDrawerRef = ref<InstanceType<typeof UserDetailDrawer>>()
// 详情
const onDetail = (record: UserResp) => {
  UserDetailDrawerRef.value?.onOpen(record.id)
}

const UserResetPwdModalRef = ref<InstanceType<typeof UserResetPwdModal>>()
// 重置密码
const onResetPwd = (record: UserResp) => {
  UserResetPwdModalRef.value?.onOpen(record.id)
}

const UserUpdateRoleModalRef = ref<InstanceType<typeof UserUpdateRoleModal>>()
// 分配角色
const onUpdateRole = (record: UserResp) => {
  UserUpdateRoleModalRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss">
.page_header {
  flex: 0 0 auto;
}

.page_content {
  flex: 1;
  overflow: auto;
}
</style>
