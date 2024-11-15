<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.whse.stock.out.detail.table')"
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
        <a-input v-model="queryForm.stockOutId" placeholder="请输入出库单号" allow-clear @change="search">
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
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:whseStockOutDetail:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['wms:whseStockOutDetail:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:whseStockOutDetail:list']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
          <a-link v-permission="['wms:whseStockOutDetail:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link
            v-permission="['wms:whseStockOutDetail:delete']"
            status="danger"
            :disabled="record.disabled"
            :title="$t('page.common.button.delete')"
            @click="onDelete(record)"
          >
            {{ $t('page.common.button.delete') }}
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <WhseStockOutDetailAddModal ref="WhseStockOutDetailAddModalRef" @save-success="search" />
    <WhseStockOutDetailDetailDrawer ref="WhseStockOutDetailDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WhseStockOutDetailAddModal from './WhseStockOutDetailAddModal.vue'
import WhseStockOutDetailDetailDrawer from './WhseStockOutDetailDetailDrawer.vue'
import { type WhseStockOutDetailQuery, type WhseStockOutInfoResp, deleteWhseStockOutDetail, exportWhseStockOutDetail, listWhseStockOutDetail } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'WhseStockOutDetail' })
const { t } = useI18n()

const queryForm = reactive<WhseStockOutDetailQuery>({
  stockOutId: undefined,
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
} = useTable((page) => listWhseStockOutDetail({ ...queryForm, ...page }), { immediate: true })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  { title: t('wms.whse.stock.out.detail.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.whse.stock.out.detail.field.stockOutId'), dataIndex: 'stockOutId', slotName: 'stockOutId' },
  { title: t('wms.whse.stock.out.detail.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.whse.stock.out.detail.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: t('wms.whse.stock.out.detail.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.whse.stock.out.detail.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.whse.stock.out.detail.field.planNum'), dataIndex: 'planNum', slotName: 'planNum' },
  { title: t('wms.whse.stock.out.detail.field.realNum'), dataIndex: 'realNum', slotName: 'realNum' },
  { title: t('wms.whse.stock.out.detail.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.whse.stock.out.detail.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.whse.stock.out.detail.field.createUser'), dataIndex: 'createUser', slotName: 'createUser' },
  { title: t('wms.whse.stock.out.detail.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    dataIndex: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockOutDetail:update', 'wms:whseStockOutDetail:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.stockOutId = undefined
  queryForm.goodsSku = undefined
  queryForm.goodsName = undefined
  search()
}

// 删除
const onDelete = (record: WhseStockOutInfoResp) => {
  return handleDelete(() => deleteWhseStockOutDetail(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportWhseStockOutDetail(queryForm))
}

const WhseStockOutDetailAddModalRef = ref<InstanceType<typeof WhseStockOutDetailAddModal>>()
// 新增
const onAdd = () => {
  WhseStockOutDetailAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: WhseStockOutInfoResp) => {
  WhseStockOutDetailAddModalRef.value?.onUpdate(record.id)
}

const WhseStockOutDetailDetailDrawerRef = ref<InstanceType<typeof WhseStockOutDetailDetailDrawer>>()
// 详情
const onDetail = (record: WhseStockOutInfoResp) => {
  WhseStockOutDetailDetailDrawerRef.value?.onDetail(record.id)
}
</script>

<style lang="scss" scoped></style>
