<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import WhseStockOutDetailDetailDrawer from './WhseStockOutDetailDetailDrawer.vue'
import GoodsListModal from './goodsListModal.vue'
import { type WhseStockOutDetailDetailResp, type WhseStockOutDetailQuery, type WhseStockOutInfoResp, deleteWhseStockOutDetail, exportWhseStockOutDetail, exportWhseStockOutInfo, getWhseStockOutInfo, listWhseStockOutDetail, updateWhseStockOutDetail, updateWhseStockOutStatus } from '@/apis/wms'

import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'WhseStockOutDetail' })
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const stockOutId = ref<string>()
const stockOutDetail = ref<WhseStockOutInfoResp>()

const queryForm = reactive<WhseStockOutDetailQuery>({
  stockOutId: undefined,
  goodsSku: undefined,
  goodsName: undefined,
  sort: ['createTime,desc'],
})

const {
  tableData: dataList,
  loading,
  // pagination,
  // search,
  handleDelete,
} = useTable((page) => listWhseStockOutDetail({ ...queryForm, ...page }), { immediate: false })

const getStockOutInfo = async () => {
  stockOutId.value = route.query.id as string // 获取query参数
  // 获取入库单详情
  const res = await getWhseStockOutInfo(stockOutId.value)
  stockOutDetail.value = res.data
  dataList.value = res.data.goodsList ?? []
  queryForm.stockOutId = stockOutId.value
}

onMounted(async () => {
  await getStockOutInfo()
})

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.whse.stock.out.detail.field.id'), dataIndex: 'id', slotName: 'id' },
  // { title: t('wms.whse.stock.out.detail.field.stockOutId'), dataIndex: 'stockOutId', slotName: 'stockOutId' },
  { title: t('wms.whse.stock.out.detail.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.whse.stock.out.detail.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: t('wms.whse.stock.out.detail.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.whse.stock.out.detail.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.whse.stock.out.detail.field.planNum'), dataIndex: 'planNum', slotName: 'planNum' },
  // { title: t('wms.whse.stock.out.detail.field.realNum'), dataIndex: 'realNum', slotName: 'realNum' },
  { title: t('wms.whse.stock.out.detail.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  // { title: t('wms.whse.stock.out.detail.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.whse.stock.out.detail.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.whse.stock.out.detail.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    dataIndex: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockOutDetail:detail', 'wms:whseStockOutDetail:update', 'wms:whseStockOutDetail:delete']),
  },
])

// 重置
// const reset = () => {
//   queryForm.stockOutId = undefined
//   queryForm.goodsSku = undefined
//   queryForm.goodsName = undefined
//   getStockOutInfo()
// }

// 删除
const onDelete = (record: WhseStockOutInfoResp) => {
  return handleDelete(() => deleteWhseStockOutDetail(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportWhseStockOutInfo(stockOutId.value!))
}

const goodsListModalRef = ref<InstanceType<typeof GoodsListModal>>()
// 新增
const onAdd = () => {
  goodsListModalRef.value?.show(stockOutDetail.value!.whseId, stockOutId.value!)
}

const WhseStockOutDetailDetailDrawerRef = ref<InstanceType<typeof WhseStockOutDetailDetailDrawer>>()
// 详情
// const onDetail = (record: WhseStockOutInfoResp) => {
//   WhseStockOutDetailDetailDrawerRef.value?.onDetail(record.id)
// }

const stockOutDone = async () => {
  for (const item of dataList.value ?? []) {
    if (item.status !== 2) {
      Message.error(t('wms.whse.stock.in.error.stockInDone'))
      return
    }
  }

  const res = await updateWhseStockOutStatus(stockOutId.value!, 3)
  if (res.success) {
    Message.success(t('page.common.message.modify.success'))
    await getStockOutInfo()
  }
}

// 审核当前物料可出库
const onAudit = async (record: WhseStockOutDetailDetailResp) => {
  record.status = 2
  if (!record.realNum) {
    record.realNum = record.planNum
  }
  await updateWhseStockOutDetail(record, record.id)
  await getStockOutInfo()
  Message.success(t('page.common.message.modify.success'))
}

const onCancelAudit = async (record: WhseStockOutInfoResp) => {
  record.status = 1
  await updateWhseStockOutDetail(record, record.id)
  await getStockOutInfo()
  Message.success(t('page.common.message.modify.success'))
}

const to_stock_move_info = (moveId: string) => {
  // WhseStockMoveDetailDrawerRef.value?.onOpen(record.id)
  router.push({ path: '/wms/whse/stock/move/detail', query: { id: moveId } })
}
</script>

<template>
  <div class="table-page">
    <a-card :title="$t('wms.whse.stock.in.detail.billInfo.title')">
      <template #extra>
        <a-button v-if="stockOutDetail?.status === 2" @click="stockOutDone()">{{ $t('page.common.tips.allFinish') }}</a-button>
        <a-button v-permission="['wms:whseStockOutDetail:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <a-row>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.out.field.stockOutNo') }}: {{ stockOutDetail?.stockOutNo }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.out.field.name') }}: {{ stockOutDetail?.name }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.out.field.whseId') }}: {{ stockOutDetail?.whseName }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.out.field.stockMoveId') }}: <a-link @click="to_stock_move_info(stockOutDetail?.stockMoveId!)">{{ stockOutDetail?.stockMoveNo }} </a-link></span>
        </a-col>
      </a-row>
    </a-card>
    <a-card :title="$t('wms.whse.stock.out.detail.table')" class="mb--16px">
    </a-card>
    <GiTable
      row-key="id"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="getStockOutInfo"
    >
      <template #planNum="{ record }">
        <span v-if="stockOutDetail?.whseType === 1">
          {{ record.planNum }}  {{ record.goodsUnit }}
        </span>
        <span v-else>
          {{ record.planNum ? `${record.planNum} ${record.goodsPackUnit}` : "" }}
        </span>
      </template>
      <!-- <template #toolbar-left>
          <a-input v-model="queryForm.stockOutId" placeholder="请输入出库单号" allow-clear @change="getStockOutInfo">
            <template #prefix><icon-search /></template>
          </a-input>
          <a-input v-model="queryForm.goodsSku" placeholder="请输入商品sku" allow-clear @change="getStockOutInfo">
            <template #prefix><icon-search /></template>
          </a-input>
          <a-input v-model="queryForm.goodsName" placeholder="请输入商品名称" allow-clear @change="getStockOutInfo">
            <template #prefix><icon-search /></template>
          </a-input>
          <a-button @click="reset">
            <template #icon><icon-refresh /></template>
            <template #default>{{ $t('page.common.button.reset') }}</template>
          </a-button>
        </template> -->
      <template #toolbar-right>
        <a-button v-if="stockOutDetail?.status === 1 " v-permission="['wms:whseStockOutDetail:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <!-- <a-button v-permission="['wms:whseStockOutDetail:export']" @click="onExport">
            <template #icon><icon-download /></template>
            <template #default>{{ $t('page.common.button.export') }}</template>
          </a-button> -->
      </template>
      <template #action="{ record }">
        <a-space>
          <!-- <a-link v-permission="['wms:whseStockOutDetail:detail']" @click="onDetail(record)">{{ $t('page.common.button.detail') }}</a-link> -->
          <!-- <a-link v-permission="['wms:whseStockOutDetail:update']"  @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link> -->
          <a-link
            v-if="stockOutDetail?.status === 1"
            v-permission="['wms:whseStockOutDetail:delete']"
            status="danger"
            :disabled="record.disabled"
            :title="$t('page.common.button.delete')"
            @click="onDelete(record)"
          >
            {{ $t('page.common.button.delete') }}
          </a-link>
          <a-link v-if="stockOutDetail?.status === 2 && record.status !== 2 " v-permission="['wms:whseStockInDetail:update']" @click="onAudit(record)">{{ $t('page.common.button.audit') }}</a-link>
          <a-link v-if="stockOutDetail?.status === 2 && record.status === 2" v-permission="['wms:whseStockInDetail:update']" @click="onCancelAudit(record)">{{ $t('page.common.button.cancel.audit') }}</a-link>
        </a-space>
      </template>
    </GiTable>

    <GoodsListModal ref="goodsListModalRef" @save-success="getStockOutInfo" />
    <WhseStockOutDetailDetailDrawer ref="WhseStockOutDetailDetailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
