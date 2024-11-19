<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GoodsListModal from './goodsListModal.vue'
import WhseStockMoveDetialDetailDrawer from './WhseStockMoveDetialDetailDrawer.vue'
import { type WhseStockMoveDetialQuery, type WhseStockMoveDetialResp, deleteWhseStockMoveDetial, exportWhseStockMoveDetial, getWhseStockMoveDetail, listWhseStockMoveDetial } from '@/apis/wms/whseStockMoveDetail'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import type { WhseStockMoveDetailResp } from '@/apis/wms'
import { getWhseStockMove } from '@/apis/wms'

defineOptions({ name: 'WmsWhseStockMoveDetail' })

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const stockMoveId = ref<string>()
const stockMoveDetail = ref<WhseStockMoveDetailResp>()

const queryForm = reactive<WhseStockMoveDetialQuery>({
  stockMoveId: undefined,
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
} = useTable((page) => listWhseStockMoveDetial({ ...queryForm, ...page }), { immediate: false })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.whse.stock.move.detial.field.id'), dataIndex: 'id', slotName: 'id' },
  // { title: t('wms.whse.stock.move.detial.field.stockMoveNo'), dataIndex: 'stockMoveNo', slotName: 'stockMoveNo' },
  // { title: t('wms.whse.stock.move.detial.field.goodsStockId'), dataIndex: 'goodsStockId', slotName: 'goodsStockId' },
  { title: t('wms.whse.stock.move.detial.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.whse.stock.move.detial.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: t('wms.whse.stock.move.detial.field.moveTime'), dataIndex: 'moveTime', slotName: 'moveTime' },
  { title: t('wms.whse.stock.move.detial.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.whse.stock.move.detial.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.whse.stock.move.detial.field.planNum'), dataIndex: 'planNum', slotName: 'planNum' },
  { title: t('wms.whse.stock.move.detial.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.whse.stock.move.detial.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
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

const getStockMoveInfo = async () => {
  stockMoveId.value = route.query.id as string // 获取query参数
  // 获取入库单详情
  const res = await getWhseStockMove(stockMoveId.value)
  stockMoveDetail.value = res.data
  dataList.value = res.data.goodsList ?? []
  queryForm.stockMoveId = stockMoveId.value
}

onMounted(async () => {
  await getStockMoveInfo()
})

// 删除
const onDelete = (record: WhseStockMoveDetialResp) => {
  return handleDelete(() => deleteWhseStockMoveDetial(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
// const onExport = () => {
//   useDownload(() => exportWhseStockMoveDetial(queryForm))
// }

const goodsListModalRef = ref<InstanceType<typeof GoodsListModal>>()
// 新增
const onAdd = () => {
  goodsListModalRef.value?.show(stockMoveDetail.value!.stockOutWhseId, stockMoveId.value!)
}

const WhseStockMoveDetialDetailDrawerRef = ref<InstanceType<typeof WhseStockMoveDetialDetailDrawer>>()
// 详情
const onDetail = (record: WhseStockMoveDetialResp) => {
  WhseStockMoveDetialDetailDrawerRef.value?.onOpen(record.id)
}

// const stockMoveDone = async () => {
// for (const item of dataList.value ?? []) {
//   if (item.status !== 2) {
//     Message.error(t('wms.whse.stock.in.error.stockInDone'))
//     return
//   }
// }

// const res = await updateWhseStockOutStatus(stockOutId.value!, 3)
// if (res.success) {
//   Message.success(t('page.common.message.modify.success'))
//   await getStockOutInfo()
// }
// }

// 查看，跳转到详情页
const to_stock_out_info = (stockOutId: string) => {
  router.push({ path: '/wms/whse/stockOut/detail', query: { id: stockOutId } })
}

// 查看，跳转到详情页
const to_stock_in_info = (stockInId: string) => {
  router.push({ path: '/wms/whse/stockIn/detail', query: { id: stockInId } })
}
</script>

<template>
  <div class="table-page">
    <a-card :title="$t('wms.whse.stock.in.detail.billInfo.title')">
      <!-- <template #extra>
        <a-button v-if="stockMoveDetail?.status === 2" @click="stockMoveDone()">全部完成</a-button>
      </template> -->
      <a-row>
        <a-col :span="6">
          <span>移库单号: {{ stockMoveDetail?.stockMoveNo }}</span>
        </a-col>
        <a-col :span="6">
          <span>移库名称: {{ stockMoveDetail?.name }}</span>
        </a-col>
        <a-col :span="6">
          <span>出库地址: {{ stockMoveDetail?.stockOutWhseName }}</span>
        </a-col>
        <a-col :span="6">
          <span>出库单号: <span @click="to_stock_out_info(stockMoveDetail?.stockOutId!)">{{ stockMoveDetail?.stockOutId }}</span></span>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <span>入库地址: {{ stockMoveDetail?.stockInWhseName }}</span>
        </a-col>
        <a-col :span="6">
          <span>入库单号名称: <span @click="to_stock_in_info(stockMoveDetail?.stockInId!)">{{ stockMoveDetail?.stockInId }}</span></span>
        </a-col>
      </a-row>
    </a-card>
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
      <!-- <template #toolbar-left>
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
      </template> -->
      <template #toolbar-right>
        <a-button v-if="stockMoveDetail?.status === 1" v-permission="['wms:whseStockMoveDetial:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <!-- <a-button v-permission="['wms:whseStockMoveDetial:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button> -->
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:whseStockMoveDetial:detail']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
          <!-- <a-link v-permission="['wms:whseStockMoveDetial:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link> -->
          <a-link
            v-if="stockMoveDetail?.status === 1"
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

    <GoodsListModal ref="goodsListModalRef" @save-success="search" />
    <WhseStockMoveDetialDetailDrawer ref="WhseStockMoveDetialDetailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
