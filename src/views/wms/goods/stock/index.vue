<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GoodsStockAddModal from './GoodsStockAddModal.vue'
import GoodsStockDetailDrawer from './GoodsStockDetailDrawer.vue'
import { type GoodsStockQuery, type GoodsStockResp, deleteGoodsStock, exportGoodsStock, listGoodsStock } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'WmsGoodsStock' })
const { t } = useI18n()

const status_enum = computed(() => [{
  value: '1',
  label: t('wms.whse.stock.in.state.s1'),
  other: 'extra',
}, {
  value: '2',
  label: t('wms.whse.stock.in.state.s2'),
  other: 'extra',
}, {
  value: '3',
  label: t('wms.whse.stock.in.state.s3'),
  other: 'extra',
}])

const queryForm = reactive<GoodsStockQuery>({
  stockInId: undefined,
  stockInNo: undefined,
  stockInDetailId: undefined,
  goodsId: undefined,
  goodsSku: undefined,
  whseType: undefined,
  whseId: undefined,
  status: undefined,
  prodTime: undefined,
  expiryTime: undefined,
  sort: ['createTime,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listGoodsStock({ ...queryForm, ...page }), { immediate: true })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.goods.stock.field.id'), dataIndex: 'id', slotName: 'id' },
  // { title: t('wms.goods.stock.field.stockInId'), dataIndex: 'stockInId', slotName: 'stockInId' },

  // { title: t('wms.goods.stock.field.stockInDetailId'), dataIndex: 'stockInDetailId', slotName: 'stockInDetailId' },
  // { title: t('wms.goods.stock.field.goodsId'), dataIndex: 'goodsId', slotName: 'goodsId' },
  { title: t('wms.goods.stock.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: t('wms.goods.stock.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.goods.stock.field.stockInNo'), dataIndex: 'stockInNo', slotName: 'stockInNo' },
  { title: t('wms.goods.stock.field.initNum'), dataIndex: 'initNum', slotName: 'initNum' },
  { title: t('wms.goods.stock.field.realNum'), dataIndex: 'realNum', slotName: 'realNum' },
  { title: t('wms.goods.stock.field.whseType'), dataIndex: 'whseType', slotName: 'whseType' },
  // { title: t('wms.goods.stock.field.whseId'), dataIndex: 'whseId', slotName: 'whseId' },
  { title: t('wms.goods.stock.field.whseName'), dataIndex: 'whseName', slotName: 'whseId' },
  { title: t('wms.goods.stock.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.goods.stock.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.goods.stock.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.goods.stock.field.info'), dataIndex: 'info', slotName: 'info' },
  { title: t('wms.goods.stock.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.goods.stock.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  // { title: t('wms.goods.stock.field.updateUser'), dataIndex: 'updateUserString', slotName: 'updateUser' },
  // { title: t('wms.goods.stock.field.updateTime'), dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    dataIndex: 'action',
    width: 180,
    // align: 'center',
    // fixed: !isMobile() ? 'right' : undefined,
    // show: has.hasPermOr(['wms:goodsStock:update', 'wms:goodsStock:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.stockInId = undefined
  queryForm.stockInNo = undefined
  queryForm.stockInDetailId = undefined
  queryForm.goodsId = undefined
  queryForm.goodsSku = undefined
  queryForm.whseType = undefined
  queryForm.whseId = undefined
  queryForm.status = undefined
  queryForm.prodTime = undefined
  queryForm.expiryTime = undefined
  search()
}

// 删除
const onDelete = (record: GoodsStockResp) => {
  return handleDelete(() => deleteGoodsStock(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportGoodsStock(queryForm))
}

const GoodsStockAddModalRef = ref<InstanceType<typeof GoodsStockAddModal>>()
// 新增
const onAdd = () => {
  GoodsStockAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: GoodsStockResp) => {
  GoodsStockAddModalRef.value?.onUpdate(record.id)
}

const GoodsStockDetailDrawerRef = ref<InstanceType<typeof GoodsStockDetailDrawer>>()
// 详情
const onDetail = (record: GoodsStockResp) => {
  GoodsStockDetailDrawerRef.value?.onDetail(record.id)
}
</script>

<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.goods.stock.table')"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="pagination"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="search"
    >
      <template #initNum="{ record }">
        <span v-if="record.whseType === 1">
          {{ record.initNum }}  {{ record.goodsUnit }}
        </span>
        <span v-else>
          {{ record.initNum }}  {{ record.goodsPackUnit }}
        </span>
      </template>
      <template #realNum="{ record }">
        <span v-if="record.whseType === 1">
          {{ record.realNum }}  {{ record.goodsUnit }}
        </span>
        <span v-else>
          {{ record.realNum }}  {{ record.goodsPackUnit }}
        </span>
      </template>
      <template #toolbar-left>
        <!-- <a-input v-model="queryForm.stockInId" placeholder="请输入入库单编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <a-input v-model="queryForm.stockInNo" placeholder="请输入入库单号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-input v-model="queryForm.stockInDetailId" placeholder="请输入入库单明细编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <!-- <a-input v-model="queryForm.goodsId" placeholder="请输入物料编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <a-input v-model="queryForm.goodsSku" placeholder="请输入物料sku条码" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-radio-group v-model="queryForm.whseType" :options="" @change="search" /> -->
        <!-- <a-input v-model="queryForm.whseId" placeholder="请输入仓库id" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <CustomWhseSelect v-model="queryForm.whseId" style="width:240px" placeholder="请选择仓库" @change="search"></CustomWhseSelect>
        <!-- <a-select
          v-model="queryForm.status"
          :options="status_enum"
          placeholder="请选择状态 1待出库 2已出库 3部分出库"
          allow-clear
          style="width: 150px"
          @change="search"
        /> -->
        <DateRangePicker v-model="queryForm.prodTime" @change="search" />
        <DateRangePicker v-model="queryForm.expiryTime" @change="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:goodsStock:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['wms:goodsStock:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:goodsStock:list']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
          <a-link v-permission="['wms:goodsStock:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link
            v-permission="['wms:goodsStock:delete']"
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

    <GoodsStockAddModal ref="GoodsStockAddModalRef" @save-success="search" />
    <GoodsStockDetailDrawer ref="GoodsStockDetailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
