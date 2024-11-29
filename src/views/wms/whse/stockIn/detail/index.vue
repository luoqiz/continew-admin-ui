<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import WhseStockInDetailAddModal from './WhseStockInDetailAddModal.vue'
import WhseStockInDetailDetailDrawer from './WhseStockInDetailDetailDrawer.vue'
import { type WhseStockInDetailDetailResp, type WhseStockInDetailQuery, type WhseStockInDetailResp, type WhseStockInInfoResp, deleteWhseStockInDetail, exportWhseStockInInfo, getWhseStockInInfo, listWhseStockInDetail, updateWhseStockInDetail, updateWhseStockInStatus } from '@/apis/wms'

import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'WmsWhseStockInDetail' })

const route = useRoute()
const router = useRouter()
const stockInId = ref<string>()
const stockInDetail = ref<WhseStockInInfoResp>()

const { t } = useI18n()

const queryForm = reactive<WhseStockInDetailQuery>({
  stockInId: stockInId.value,
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
} = useTable((page) => listWhseStockInDetail({ ...queryForm, ...page }), { immediate: false })

const getStockInInfo = async () => {
  stockInId.value = route.query.id as string // 获取query参数
  // 获取入库单详情
  const res = await getWhseStockInInfo(stockInId.value)
  stockInDetail.value = res.data
  dataList.value = res.data.goodsList ?? []
  queryForm.stockInId = stockInId.value
}

onMounted(async () => {
  await getStockInInfo()
})

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.whse.stock.in.detail.field.id'), dataIndex: 'id', slotName: 'id' },
  // { title: t('wms.whse.stock.in.detail.field.stockInId'), dataIndex: 'stockInId', slotName: 'stockInId' },
  { title: t('wms.whse.stock.in.detail.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.whse.stock.in.detail.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: t('wms.whse.stock.in.detail.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.whse.stock.in.detail.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.whse.stock.in.detail.field.planNum'), dataIndex: 'planNum', slotName: 'planNum' },
  { title: t('wms.whse.stock.in.detail.field.realNum'), dataIndex: 'realNum', slotName: 'realNum' },
  { title: t('wms.whse.stock.in.detail.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.whse.stock.in.detail.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.whse.stock.in.detail.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },

  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockInDetail:list', 'wms:whseStockInDetail:update', 'wms:whseStockInDetail:delete']),
  },
])

// 重置
// const reset = () => {
//   queryForm.stockInId = undefined
//   queryForm.goodsSku = undefined
//   queryForm.goodsName = undefined
//   search()
// }

// 删除
const onDelete = (record: WhseStockInDetailResp) => {
  return handleDelete(() => deleteWhseStockInDetail(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportWhseStockInInfo(stockInId.value!))
}

const WhseStockInDetailAddModalRef = ref<InstanceType<typeof WhseStockInDetailAddModal>>()
// 新增
const onAdd = () => {
  WhseStockInDetailAddModalRef.value?.onAdd(stockInId.value!)
}

// 修改
const onUpdate = (record: WhseStockInInfoResp) => {
  WhseStockInDetailAddModalRef.value?.onUpdate(record.id)
}

const WhseStockInDetailDetailDrawerRef = ref<InstanceType<typeof WhseStockInDetailDetailDrawer>>()
// 详情
const onDetail = (record: WhseStockInDetailDetailResp) => {
  WhseStockInDetailDetailDrawerRef.value?.onDetail(record.id)
}

// 审核当前物料可入库
const onAudit = async (record: WhseStockInDetailDetailResp) => {
  record.status = 2
  if (!record.realNum) {
    record.realNum = record.planNum
  }
  await updateWhseStockInDetail(record, record.id)
  Message.success(t('page.common.message.modify.success'))
}

const onCancelAudit = async (record: WhseStockInInfoResp) => {
  record.status = 1
  await updateWhseStockInDetail(record, record.id)
  Message.success(t('page.common.message.modify.success'))
}

const stockInDone = async () => {
  for (const item of dataList.value ?? []) {
    if (item.status !== 2) {
      Message.error(t('wms.whse.stock.in.error.stockInDone'))
      return
    }
  }

  const res = await updateWhseStockInStatus(stockInId.value!, 3)
  if (res.success) {
    Message.success(t('page.common.message.modify.success'))
    await getStockInInfo()
  }
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
        <a-button v-if="stockInDetail?.status === 2" @click="stockInDone()">全部完成</a-button>
        <a-button v-permission="['wms:whseStockInDetail:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <a-row>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.in.field.stockInNo') }}:  {{ stockInDetail?.stockInNo }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.in.field.name') }}:  {{ stockInDetail?.name }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.in.field.whseId') }}:  {{ stockInDetail?.whseName }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ $t('wms.whse.stock.in.field.stockMoveId') }}:   <a-link @click="to_stock_move_info(stockInDetail?.stockMoveId!)">{{ stockInDetail?.stockMoveNo }}</a-link></span>
        </a-col>
      </a-row>
    </a-card>
    <a-card :title="$t('wms.whse.stock.in.detail.table')">
      <GiTable
        row-key="id"
        :data="dataList"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
        :disabled-tools="['size']"
        :disabled-column-keys="['name']"
        @refresh="getStockInInfo"
      >
        <template #planNum="{ record }">
          <span v-if="stockInDetail?.whseType === 1 || stockInDetail?.whseType === 2">
            {{ record.planNum }}  {{ record.goodsUnit }}
          </span>
          <span v-else>
            {{ record.planNum ? `${record.planNum} ${record.goodsPackUnit}` : "" }}
          </span>
        </template>
        <template #realNum="{ record }">
          <span v-if="stockInDetail?.whseType === 1 || stockInDetail?.whseType === 2">
            {{ record.realNum ? `${record.realNum} ${record.goodsUnit}` : "" }}
          </span>
          <span v-else>
            {{ record.realNum ? `${record.realNum} ${record.goodsPackUnit}` : "" }}
          </span>
        </template>
        <!-- <template #toolbar-left>
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
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template> -->
        <template #toolbar-right>
          <a-button v-if="stockInDetail?.status === 1" v-permission="['wms:whseStockInDetail:add']" type="primary" @click="onAdd">
            <template #icon><icon-plus /></template>
            <template #default>{{ $t('page.common.button.add') }}</template>
          </a-button>
        <!-- <a-button v-permission="['wms:whseStockInDetail:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button> -->
        </template>
        <template #action="{ record }">
          <a-space>
            <span v-if="stockInDetail?.status === 1">
              <a-link v-permission="['wms:whseStockInDetail:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
              <a-link
                v-permission="['wms:whseStockInDetail:delete']"
                status="danger"
                :disabled="record.disabled"
                @click="onDelete(record)"
              >
                {{ $t('page.common.button.delete') }}
              </a-link>
            </span>
            <span v-if="stockInDetail?.status === 2">
              <!-- <a-link v-permission="['wms:whseStockInDetail:list']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link> -->
              <a-link v-if="record.status !== 2" v-permission="['wms:whseStockInDetail:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
              <a-link v-if="record.status !== 2" v-permission="['wms:whseStockInDetail:update']" :title="$t('page.common.button.audit')" @click="onAudit(record)">{{ $t('page.common.button.audit') }}</a-link>
              <a-link v-if="record.status === 2" v-permission="['wms:whseStockInDetail:update']" :title="$t('page.common.button.cancel.audit')" @click="onCancelAudit(record)">{{ $t('page.common.button.cancel.audit') }}</a-link>
            </span>
          </a-space>
        </template>
      </GiTable>
    </a-card>

    <WhseStockInDetailAddModal ref="WhseStockInDetailAddModalRef" @save-success="getStockInInfo" />
    <WhseStockInDetailDetailDrawer ref="WhseStockInDetailDetailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
