<template>
  <div class="table-page">
    <GiTable
      ref="tableRef"
      :title="$t('sys.dept.table')"
      row-key="id"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="false"
      :disabled-column-keys="['name']"
      @refresh="search"
    >
      <template #expand-icon="{ expanded }">
        <IconDown v-if="expanded" />
        <IconRight v-else />
      </template>
      <template #toolbar-left>
        <a-input v-model="name" :placeholder="$t('sys.dept.field.name_placeholder')" allow-clear>
          <template #prefix><icon-search /></template>
        </a-input>
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['system:dept:add']" type="primary" @click="onAdd()">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['system:dept:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
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
          <a-link v-permission="['system:dept:update']" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link
            v-permission="['system:dept:delete']"
            status="danger"
            :disabled="record.isSystem"
            :title="record.isSystem ? $t('page.common.tips.data.notDelete') : $t('page.common.button.delete')"
            @click="onDelete(record)"
          >
            {{ $t('page.common.button.delete') }}
          </a-link>
          <a-link v-permission="['system:dept:add']" @click="onAdd(record.id)">{{ $t('page.common.button.add') }}</a-link>
        </a-space>
      </template>
    </GiTable>

    <DeptAddModal ref="DeptAddModalRef" :depts="dataList" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DeptAddModal from './DeptAddModal.vue'
import { type DeptQuery, type DeptResp, deleteDept, exportDept, listDept } from '@/apis/system/dept'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import type GiTable from '@/components/GiTable/index.vue'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'SystemDept' })

const { t } = useI18n()

const queryForm = reactive<DeptQuery>({})
const tableRef = ref<InstanceType<typeof GiTable>>()
const {
  tableData,
  loading,
  search,
  handleDelete,
} = useTable(() => listDept(queryForm), {
  immediate: true,
  onSuccess: () => {
    nextTick(() => {
      tableRef.value?.tableRef?.expandAll(true)
    })
  },
})

// 过滤树
const searchData = (name: string) => {
  const loop = (data: DeptResp[]) => {
    const result = [] as DeptResp[]
    data.forEach((item: DeptResp) => {
      if (item.name?.toLowerCase().includes(name.toLowerCase())) {
        result.push({ ...item })
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData,
          })
        }
      }
    })
    return result
  }
  return loop(tableData.value)
}

const name = ref('')
const dataList = computed(() => {
  if (!name.value) return tableData.value
  return searchData(name.value)
})

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  { title: t('sys.dept.field.name'), dataIndex: 'name', minWidth: 170, ellipsis: true, tooltip: true },
  { title: t('sys.dept.field.status'), dataIndex: 'status', slotName: 'status', align: 'center' },
  { title: t('sys.dept.field.sort'), dataIndex: 'sort', align: 'center', show: false },
  { title: t('sys.dept.field.isSystem'), dataIndex: 'isSystem', slotName: 'isSystem', align: 'center', show: false },
  { title: t('sys.dept.field.description'), dataIndex: 'description', ellipsis: true, tooltip: true },
  { title: t('sys.dept.field.createUser'), dataIndex: 'createUserString', ellipsis: true, tooltip: true, show: false },
  { title: t('sys.dept.field.createTime'), dataIndex: 'createTime', width: 180 },
  { title: t('sys.dept.field.updateUser'), dataIndex: 'updateUserString', ellipsis: true, tooltip: true, show: false },
  { title: t('sys.dept.field.updateTime'), dataIndex: 'updateTime', width: 180, show: false },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['system:dept:update', 'system:dept:delete', 'system:dept:add']),
  },
])

// 重置
const reset = () => {
  name.value = ''
}

// 删除
const onDelete = (record: DeptResp) => {
  return handleDelete(() => deleteDept(record.id), {
    content: `${t('sys.dept.tips.delete')}「${record.name}」？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportDept(queryForm))
}

const DeptAddModalRef = ref<InstanceType<typeof DeptAddModal>>()
// 新增
const onAdd = (parentId?: string) => {
  DeptAddModalRef.value?.onAdd(parentId)
}

// 修改
const onUpdate = (record: DeptResp) => {
  DeptAddModalRef.value?.onUpdate(record.id)
}
</script>

<style scoped lang="scss"></style>
