<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      title="仓库地址管理"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="pagination"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="search"
    >
      <template #status="{ record }">
        <span>{{ record.status === 1 ? '使用' : '停用' }}</span>
      </template>
      <template #toolbar-left>
        <a-input v-model="queryForm.whseNo" placeholder="请输入仓库编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.name" placeholder="请输入仓库名称" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-input v-model="queryForm.status" placeholder="请输入状态 (1使用  2停用)" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:addr:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['wms:addr:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>导出</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:addr:list']" title="查看" @click="onDetail(record)">查看</a-link>
          <a-link v-permission="['wms:addr:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['wms:addr:delete']"
            status="danger"
            :disabled="record.disabled"
            title="删除"
            @click="onDelete(record)"
          >
            删除
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <AddrAddModal ref="AddrAddModalRef" @save-success="search" />
    <AddrDetailDrawer ref="AddrDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import AddrAddModal from './AddrAddModal.vue'
import AddrDetailDrawer from './AddrDetailDrawer.vue'
import { type AddrQuery, type AddrResp, deleteAddr, exportAddr, listAddr, listAddrStore } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'WmsWhseCountry' })

const queryForm = reactive<AddrQuery>({
  whseNo: undefined,
  whseType: 3,
  name: undefined,
  status: undefined,
  sort: ['createTime,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listAddrStore({ ...queryForm, ...page }), { immediate: true })

const columns: TableInstanceColumns[] = [
  // { title: 'id编号', dataIndex: 'id', slotName: 'id' },
  { title: '仓库编号', dataIndex: 'whseNo', slotName: 'whseNo' },
  { title: '仓库名称', dataIndex: 'name', slotName: 'name' },
  { title: '仓库地址', dataIndex: 'addr', slotName: 'addr' },
  // { title: '仓库类型 (1国仓  2地仓  3店仓)', dataIndex: 'whseType', slotName: 'whseType' },
  { title: '状态', dataIndex: 'status', slotName: 'status' },
  { title: '备注信息', dataIndex: 'memo', slotName: 'memo' },
  { title: '所属部门', dataIndex: 'deptName', slotName: 'deptId' },
  { title: '创建人', dataIndex: 'createUserString', slotName: 'createUser' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  // { title: '修改人', dataIndex: 'updateUser', slotName: 'updateUser' },
  // { title: '修改时间', dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: '操作',
    slotName: 'action',
    width: 130,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:addr:update', 'wms:addr:delete']),
  },
]

// 重置
const reset = () => {
  queryForm.whseNo = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: AddrResp) => {
  return handleDelete(() => deleteAddr(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportAddr(queryForm))
}

const AddrAddModalRef = ref<InstanceType<typeof AddrAddModal>>()
// 新增
const onAdd = () => {
  AddrAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: AddrResp) => {
  AddrAddModalRef.value?.onUpdate(record.id)
}

const AddrDetailDrawerRef = ref<InstanceType<typeof AddrDetailDrawer>>()
// 详情
const onDetail = (record: AddrResp) => {
  AddrDetailDrawerRef.value?.onDetail(record.id)
}
</script>

<style lang="scss" scoped></style>
