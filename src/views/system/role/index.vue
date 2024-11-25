<template>
  <div class="table-page">
    <GiTable
      :title="$t('menu.system.role')"
      row-key="id"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="pagination"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="search"
    >
      <template #toolbar-left>
        <a-input v-model="queryForm.description" :placeholder="$t('sys.role.search.form.description')" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['system:role:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
      </template>
      <template #dataScope="{ record }">
        <GiCellTag :value="record.dataScope" :dict="data_scope_enum" />
      </template>
      <template #isSystem="{ record }">
        <a-tag v-if="record.isSystem" color="red" size="small">{{ $t('page.common.field.true') }}</a-tag>
        <a-tag v-else color="arcoblue" size="small">{{ $t('page.common.field.false') }}</a-tag>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['system:role:detail']" :title="$t('page.common.button.detail')" @click="onDetail(record)">{{ $t('page.common.button.detail') }}</a-link>
          <a-link v-permission="['system:role:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <!-- <a-link v-permission="['system:role:assign']" :title="$t('page.common.button.assign')" @click="onAssign(record)">{{ $t('page.common.button.assign') }}</a-link> -->
          <a-link
            v-permission="['system:role:delete']"
            status="danger"
            :disabled="record.isSystem"
            :title="record.isSystem ? $t('page.common.tips.data.notDelete') : $t('page.common.button.delete')"
            @click="onDelete(record)"
          >
            {{ $t('page.common.button.delete') }}
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <RoleAddModal ref="RoleAddModalRef" @save-success="search" />
    <RoleUpdateDrawer ref="RoleUpdateDrawerRef" @save-success="search" />
    <RoleDetailDrawer ref="RoleDetailDrawerRef" />
    <RoleAssignModal ref="RoleAssignModalRef" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RoleAddModal from './RoleAddModal.vue'
import RoleUpdateDrawer from './RoleUpdateDrawer.vue'
import RoleDetailDrawer from './RoleDetailDrawer.vue'
import RoleAssignModal from './RoleAssignModal.vue'
import { type RoleQuery, type RoleResp, deleteRole, listRole } from '@/apis/system/role'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'SystemRole' })
const { t } = useI18n()
const { data_scope_enum } = useDict('data_scope_enum')

const queryForm = reactive<RoleQuery>({
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listRole({ ...queryForm, ...page }), { immediate: true })
const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  {
    title: t('page.common.field.sn'),
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize),
  },
  { title: t('sys.role.field.name'), dataIndex: 'name', slotName: 'name', ellipsis: true, tooltip: true },
  { title: t('sys.role.field.code'), dataIndex: 'code', ellipsis: true, tooltip: true },
  { title: t('sys.role.field.dataScope'), dataIndex: 'dataScope', slotName: 'dataScope', ellipsis: true, tooltip: true },
  { title: t('sys.role.field.sort'), dataIndex: 'sort', align: 'center', show: false },
  { title: t('sys.role.field.isSystem'), dataIndex: 'isSystem', slotName: 'isSystem', align: 'center', show: false },
  { title: t('sys.role.field.description'), dataIndex: 'description', ellipsis: true, tooltip: true },
  { title: t('sys.role.field.createUser'), dataIndex: 'createUserString', ellipsis: true, tooltip: true, show: false },
  { title: t('sys.role.field.createTime'), dataIndex: 'createTime', width: 180 },
  { title: t('sys.role.field.updateUser'), dataIndex: 'updateUserString', ellipsis: true, tooltip: true, show: false },
  { title: t('sys.role.field.updateTime'), dataIndex: 'updateTime', width: 180, show: false },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 200,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr([
      'system:role:detail',
      'system:role:update',
      'system:role:delete',
      'system:role:assign',
    ]),
  },
])

// 重置
const reset = () => {
  queryForm.description = undefined
  search()
}

// 删除
const onDelete = (record: RoleResp) => {
  return handleDelete(() => deleteRole(record.id), {
    content: `${t('sys.role.tips.delete')}「${record.name}(${record.code})」？`,
    showModal: true,
  })
}

const RoleAddModalRef = ref<InstanceType<typeof RoleAddModal>>()
// 新增
const onAdd = () => {
  RoleAddModalRef.value?.onOpen()
}

const RoleUpdateDrawerRef = ref<InstanceType<typeof RoleUpdateDrawer>>()
// 修改
const onUpdate = (record: RoleResp) => {
  RoleUpdateDrawerRef.value?.onOpen(record.id)
}

const RoleDetailDrawerRef = ref<InstanceType<typeof RoleDetailDrawer>>()
// 详情
const onDetail = (record: RoleResp) => {
  RoleDetailDrawerRef.value?.onOpen(record.id)
}

const RoleAssignModalRef = ref<InstanceType<typeof RoleAssignModal>>()
// 分配
const onAssign = (record: RoleResp) => {
  RoleAssignModalRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
