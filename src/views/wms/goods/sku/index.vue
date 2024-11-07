<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      title="物料管理"
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
        <a-input v-model="queryForm.barcode" placeholder="请输入条形码" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.name" placeholder="请输入物料名称" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-radio-group v-model="queryForm.status" :options="" @change="search" /> -->
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:goodsSku:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['wms:goodsSku:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>导出</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:goodsSku:list']" title="查看" @click="onDetail(record)">查看</a-link>
          <a-link v-permission="['wms:goodsSku:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['wms:goodsSku:delete']"
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

    <GoodsSkuAddModal ref="GoodsSkuAddModalRef" @save-success="search" />
    <GoodsSkuDetailDrawer ref="GoodsSkuDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import GoodsSkuAddModal from './GoodsSkuAddModal.vue'
import GoodsSkuDetailDrawer from './GoodsSkuDetailDrawer.vue'
import { type GoodsSkuQuery, type GoodsSkuResp, deleteGoodsSku, exportGoodsSku, listGoodsSku } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'GoodsSku' })

const queryForm = reactive<GoodsSkuQuery>({
  barcode: undefined,
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
} = useTable((page) => listGoodsSku({ ...queryForm, ...page }), { immediate: true })

const columns: TableInstanceColumns[] = [
  { title: '物料名称', dataIndex: 'name', slotName: 'name' },
  // { title: '编号', dataIndex: 'id', slotName: 'id' },
  { title: '条形码', dataIndex: 'barcode', slotName: 'barcode' },
  // { title: '商品编号', dataIndex: 'spuId', slotName: 'spuId' },

  { title: '单位', dataIndex: 'unit', slotName: 'unit' },
  { title: '数量', dataIndex: 'amount', slotName: 'amount' },
  { title: '拆箱', dataIndex: 'unpacking', slotName: 'unpacking' },
  { title: '拆箱单位', dataIndex: 'packUnit', slotName: 'packUnit' },
  { title: '拆箱数量', dataIndex: 'packAmount', slotName: 'packAmount' },
  // { title: '卖点', dataIndex: 'sellPoint', slotName: 'sellPoint' },
  // { title: '规格列表', dataIndex: 'specs', slotName: 'specs' },
  { title: '售价', dataIndex: 'price', slotName: 'price' },
  // { title: '首图', dataIndex: 'img', slotName: 'img' },
  // { title: '图片列表', dataIndex: 'pics', slotName: 'pics' },
  // { title: '状态 1上架  2下架', dataIndex: 'status', slotName: 'status' },
  { title: '备注信息', dataIndex: 'memo', slotName: 'memo' },
  { title: '创建人', dataIndex: 'createUser', slotName: 'createUser' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  // { title: '修改人', dataIndex: 'updateUser', slotName: 'updateUser' },
  // { title: '修改时间', dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: '操作',
    slotName: 'action',
    width: 130,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:goodsSku:update', 'wms:goodsSku:delete']),
  },
]

// 重置
const reset = () => {
  queryForm.barcode = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: GoodsSkuResp) => {
  return handleDelete(() => deleteGoodsSku(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportGoodsSku(queryForm))
}

const GoodsSkuAddModalRef = ref<InstanceType<typeof GoodsSkuAddModal>>()
// 新增
const onAdd = () => {
  GoodsSkuAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: GoodsSkuResp) => {
  GoodsSkuAddModalRef.value?.onUpdate(record.id)
}

const GoodsSkuDetailDrawerRef = ref<InstanceType<typeof GoodsSkuDetailDrawer>>()
// 详情
const onDetail = (record: GoodsSkuResp) => {
  GoodsSkuDetailDrawerRef.value?.onDetail(record.id)
}
</script>

<style lang="scss" scoped></style>
