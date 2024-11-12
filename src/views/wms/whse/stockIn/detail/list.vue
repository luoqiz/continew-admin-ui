<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      title="仓库入库明细管理"
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
        <a-input v-model="queryForm.stockInId" placeholder="请输入入库id编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.goodsSku" placeholder="请输入商品sku" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.goodsName" placeholder="请输入商品名称" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:whseStockInDetail:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['wms:whseStockInDetail:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>导出</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:whseStockInDetail:list']" title="查看" @click="onDetail(record)">查看</a-link>
          <a-link v-permission="['wms:whseStockInDetail:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['wms:whseStockInDetail:delete']"
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

    <WhseStockInDetailAddModal ref="WhseStockInDetailAddModalRef" @save-success="search" />
    <WhseStockInDetailDetailDrawer ref="WhseStockInDetailDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import WhseStockInDetailAddModal from './WhseStockInDeatilAddModal.vue'
import WhseStockInDetailDetailDrawer from './WhseStockInDeatilDetailDrawer.vue'
import { type WhseStockInDetailQuery, type WhseStockInDetailResp, deleteWhseStockInDetail, exportWhseStockInDetail, listWhseStockInDetail } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'WmsWhseStockInDetail' })

const queryForm = reactive<WhseStockInDetailQuery>({
  stockInId: undefined,
  goodsSku: undefined,
  goodsName: undefined,
  sort: ['createTime,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listWhseStockInDetail({ ...queryForm, ...page }), { immediate: true })

const columns: TableInstanceColumns[] = [
  { title: 'id编号', dataIndex: 'id', slotName: 'id' },
  { title: '入库id编号', dataIndex: 'stockInId', slotName: 'stockInId' },
  { title: '商品sku', dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: '商品名称', dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: '生产日期', dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: '过期日期', dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: '计划入库数量', dataIndex: 'planNum', slotName: 'planNum' },
  { title: '实际入库数量', dataIndex: 'realNum', slotName: 'realNum' },
  { title: '备注信息', dataIndex: 'memo', slotName: 'memo' },
  { title: '创建人', dataIndex: 'createUser', slotName: 'createUser' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  {
    title: '操作',
    slotName: 'action',
    width: 130,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockInDetail:update', 'wms:whseStockInDetail:delete']),
  },
]

// 重置
const reset = () => {
  queryForm.stockInId = undefined
  queryForm.goodsSku = undefined
  queryForm.goodsName = undefined
  search()
}

// 删除
const onDelete = (record: WhseStockInDetailResp) => {
  return handleDelete(() => deleteWhseStockInDetail(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportWhseStockInDetail(queryForm))
}

const WhseStockInDetailAddModalRef = ref<InstanceType<typeof WhseStockInDetailAddModal>>()
// 新增
const onAdd = () => {
  WhseStockInDetailAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: WhseStockInDetailResp) => {
  WhseStockInDetailAddModalRef.value?.onUpdate(record.id)
}

const WhseStockInDetailDetailDrawerRef = ref<InstanceType<typeof WhseStockInDetailDetailDrawer>>()
// 详情
const onDetail = (record: WhseStockInDetailResp) => {
  WhseStockInDetailDetailDrawerRef.value?.onDetail(record.id)
}
</script>

<style lang="scss" scoped></style>
