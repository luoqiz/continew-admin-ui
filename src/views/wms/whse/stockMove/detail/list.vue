<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WhseStockMoveDetialAddModal from './WhseStockMoveDetialAddModal.vue'
import WhseStockMoveDetialDetailDrawer from './WhseStockMoveDetialDetailDrawer.vue'
import { type WhseStockMoveDetialQuery, type WhseStockMoveDetialResp, deleteWhseStockMoveDetial, exportWhseStockMoveDetial, listWhseStockMoveDetial } from '@/apis/wms/whseStockMoveDetail'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'WmsWhseStockMoveDetail' })

const { t } = useI18n()

const queryForm = reactive<WhseStockMoveDetialQuery>({
  stockMoveNo: undefined,
  goodsStockId: undefined,
  goodsSku: undefined,
  goodsName: undefined,
  moveTime: undefined,
  prodTime: undefined,
  expiryTime: undefined,
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listWhseStockMoveDetial({ ...queryForm, ...page }), { immediate: true })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  { title: t('wms.whse.stock.move.detial.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.whse.stock.move.detial.field.stockMoveNo'), dataIndex: 'stockMoveNo', slotName: 'stockMoveNo' },
  { title: t('wms.whse.stock.move.detial.field.goodsStockId'), dataIndex: 'goodsStockId', slotName: 'goodsStockId' },
  { title: t('wms.whse.stock.move.detial.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.whse.stock.move.detial.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: t('wms.whse.stock.move.detial.field.moveTime'), dataIndex: 'moveTime', slotName: 'moveTime' },
  { title: t('wms.whse.stock.move.detial.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.whse.stock.move.detial.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.whse.stock.move.detial.field.planNum'), dataIndex: 'planNum', slotName: 'planNum' },
  { title: t('wms.whse.stock.move.detial.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.whse.stock.move.detial.field.createUser'), dataIndex: 'createUser', slotName: 'createUser' },
  { title: t('wms.whse.stock.move.detial.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockMoveDetial:update', 'wms:whseStockMoveDetial:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.stockMoveNo = undefined
  queryForm.goodsStockId = undefined
  queryForm.goodsSku = undefined
  queryForm.goodsName = undefined
  queryForm.moveTime = undefined
  queryForm.prodTime = undefined
  queryForm.expiryTime = undefined
  search()
}

// 删除
const onDelete = (record: WhseStockMoveDetialResp) => {
  return handleDelete(() => deleteWhseStockMoveDetial(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportWhseStockMoveDetial(queryForm))
}

const WhseStockMoveDetialAddModalRef = ref<InstanceType<typeof WhseStockMoveDetialAddModal>>()
// 新增
const onAdd = () => {
  WhseStockMoveDetialAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: WhseStockMoveDetialResp) => {
  WhseStockMoveDetialAddModalRef.value?.onUpdate(record.id)
}

const WhseStockMoveDetialDetailDrawerRef = ref<InstanceType<typeof WhseStockMoveDetialDetailDrawer>>()
// 详情
const onDetail = (record: WhseStockMoveDetialResp) => {
  WhseStockMoveDetialDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.whse.stock.move.detial.table')"
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
        <a-input v-model="queryForm.stockMoveNo" placeholder="请输入移库单号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.goodsStockId" placeholder="请输入库存id" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.goodsSku" placeholder="请输入商品sku" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.goodsName" placeholder="请输入商品名称" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <DateRangePicker v-model="queryForm.moveTime" format="YYYY-MM-DD" @change="search" />
        <DateRangePicker v-model="queryForm.prodTime" format="YYYY-MM-DD" @change="search" />
        <DateRangePicker v-model="queryForm.expiryTime" format="YYYY-MM-DD" @change="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:whseStockMoveDetial:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['wms:whseStockMoveDetial:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:whseStockMoveDetial:detail']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
          <a-link v-permission="['wms:whseStockMoveDetial:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link
            v-permission="['wms:whseStockMoveDetial:delete']"
            status="danger"
            :disabled="record.disabled"
            :title="record.disabled ? $t('page.common.button.disabledDelete') : $t('page.common.button.delete')"
            @click="onDelete(record)"
          >
            {{ $t('page.common.button.delete') }}
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <WhseStockMoveDetialAddModal ref="WhseStockMoveDetialAddModalRef" @save-success="search" />
    <WhseStockMoveDetialDetailDrawer ref="WhseStockMoveDetialDetailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
