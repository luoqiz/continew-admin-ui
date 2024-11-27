<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import GoodsInventoryCountItemAddModal from './GoodsInventoryCountItemAddModal.vue'
import GoodsInventoryCountItemDetailDrawer from './GoodsInventoryCountItemDetailDrawer.vue'
import { type GoodsInventoryCountItemQuery, type GoodsInventoryCountItemResp, deleteGoodsInventoryCountItem, exportGoodsInventoryCountItem, listGoodsInventoryCountItem, updateGoodsInventoryCountItem } from '@/apis/wms/goodsInventoryCountItem'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import type { GoodsInventoryCountDetailResp } from '@/apis/wms/goodsInventoryCount'
import { exportGoodsInventoryCountDetail, getGoodsInventoryCount, updateGoodsInventoryCountStatus } from '@/apis/wms/goodsInventoryCount'

defineOptions({ name: 'GoodsInventoryCountItem' })
const { t } = useI18n()
const route = useRoute()
const icId = ref<string>()
const icDetail = ref<GoodsInventoryCountDetailResp>()

const status_enum = computed(() => [{
  value: 1,
  label: t('wms.goods.inventory.count.status.s1'),
  other: 'extra',
}, {
  value: 2,
  label: t('wms.goods.inventory.count.status.s2'),
  other: 'extra',
}, {
  value: 3,
  label: t('wms.goods.inventory.count.status.s3'),
  other: 'extra',
}])

const queryForm = reactive<GoodsInventoryCountItemQuery>({
  inventoryCountId: undefined,
  stockId: undefined,
  goodsId: undefined,
  goodsSku: undefined,
  status: undefined,
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listGoodsInventoryCountItem({ ...queryForm, ...page }), { immediate: false })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.goods.inventory.count.item.field.id'), dataIndex: 'id', slotName: 'id' },
  // { title: t('wms.goods.inventory.count.item.field.inventoryCountId'), dataIndex: 'inventoryCountId', slotName: 'inventoryCountId' },
  // { title: t('wms.goods.inventory.count.item.field.stockId'), dataIndex: 'stockId', slotName: 'stockId' },
  // { title: t('wms.goods.inventory.count.item.field.goodsId'), dataIndex: 'goodsId', slotName: 'goodsId' },
  { title: t('wms.goods.inventory.count.item.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsSku' },
  { title: t('wms.goods.inventory.count.item.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.goods.inventory.count.item.field.initNum'), dataIndex: 'initNum', slotName: 'initNum' },
  { title: t('wms.goods.inventory.count.item.field.realNum'), dataIndex: 'realNum', slotName: 'realNum' },
  // { title: t('wms.goods.inventory.count.item.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.goods.inventory.count.item.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.goods.inventory.count.item.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.goods.inventory.count.item.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.goods.inventory.count.item.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.goods.inventory.count.item.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  // { title: t('wms.goods.inventory.count.item.field.updateUser'), dataIndex: 'updateUser', slotName: 'updateUser' },
  // { title: t('wms.goods.inventory.count.item.field.updateTime'), dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:goodsInventoryCountItem:detail', 'wms:goodsInventoryCountItem:update', 'wms:goodsInventoryCountItem:delete']),
  },
])

const getStockInInfo = async () => {
  icId.value = route.query.id as string // 获取query参数
  // 获取入库单详情
  const res = await getGoodsInventoryCount(icId.value)
  icDetail.value = res.data
  queryForm.inventoryCountId = icId.value
  search()
}

onMounted(async () => {
  await getStockInInfo()
})

// 重置
const reset = () => {
  // queryForm.inventoryCountId = undefined
  queryForm.stockId = undefined
  queryForm.goodsId = undefined
  queryForm.goodsSku = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: GoodsInventoryCountItemResp) => {
  return handleDelete(() => deleteGoodsInventoryCountItem(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  if (icId.value) {
    useDownload(() => exportGoodsInventoryCountDetail(icId.value!))
  }
}

const GoodsInventoryCountItemAddModalRef = ref<InstanceType<typeof GoodsInventoryCountItemAddModal>>()
// 新增
// const onAdd = () => {
//   GoodsInventoryCountItemAddModalRef.value?.onAdd()
// }

// 修改
const onUpdate = (record: GoodsInventoryCountItemResp) => {
  GoodsInventoryCountItemAddModalRef.value?.onUpdate(record.id)
}

const GoodsInventoryCountItemDetailDrawerRef = ref<InstanceType<typeof GoodsInventoryCountItemDetailDrawer>>()
// 详情
// const onDetail = (record: GoodsInventoryCountItemResp) => {
//   GoodsInventoryCountItemDetailDrawerRef.value?.onOpen(record.id)
// }

const updateInventoryCountStatus = async (status: number) => {
  if (icId.value) {
    await updateGoodsInventoryCountStatus(icId.value!, status)
    await getStockInInfo()
    search()
  }
}

const verifySuccess = async (record: GoodsInventoryCountItemResp) => {
  record.realNum = record.initNum
  record.status = 2
  await updateGoodsInventoryCountItem(record, record.id)
  Message.success(t('page.common.message.modify.success'))
  search()
}

const verifyCancel = async (record: GoodsInventoryCountItemResp) => {
  record.realNum = 0
  record.status = 1
  await updateGoodsInventoryCountItem(record, record.id)
  Message.success(t('page.common.message.modify.success'))
  search()
}
</script>

<template>
  <div class="table-page">
    <a-card :title="$t('wms.whse.stock.in.detail.billInfo.title')">
      <template #extra>
        <a-button v-if="icDetail?.status === 1" @click="updateInventoryCountStatus(2)">
          {{ $t('wms.goods.inventory.count.startCount') }}
        </a-button>
        <a-button v-if="icDetail?.status === 2" @click="updateInventoryCountStatus(3)">
          {{ $t('wms.goods.inventory.count.endCount') }}
        </a-button>
        <a-button v-permission="['wms:whseStockInDetail:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <a-row>
        <a-col :span="6">
          <span>{{ $t('wms.goods.inventory.count.field.name') }}: {{ icDetail?.name }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ $t('wms.goods.inventory.count.field.whseId') }}: {{ icDetail?.whseName }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ t('wms.goods.inventory.count.field.startTime') }}: {{ icDetail?.startTime }}</span>
        </a-col>
        <a-col :span="6">
          <span>{{ t('wms.goods.inventory.count.field.endTime') }}: {{ icDetail?.endTime }}</span>
        </a-col>
      </a-row>
    </a-card>
    <a-card :title="$t('wms.goods.inventory.count.item.table')">
      <GiTable
        row-key="id"
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
          <!-- <a-input v-model="queryForm.inventoryCountId" placeholder="请输入盘点表id" allow-clear @change="search">
            <template #prefix><icon-search /></template>
          </a-input> -->
          <!-- <a-input v-model="queryForm.stockId" placeholder="请输入库存id" allow-clear @change="search">
            <template #prefix><icon-search /></template>
          </a-input> -->
          <!-- <a-input v-model="queryForm.goodsId" placeholder="请输入物料编号" allow-clear @change="search">
            <template #prefix><icon-search /></template>
          </a-input> -->
          <a-input v-model="queryForm.goodsSku" :placeholder="$t('wms.goods.inventory.count.item.field.goodsSku_placeholder')" allow-clear @change="search">
            <template #prefix><icon-search /></template>
          </a-input>
          <a-select
            v-model="queryForm.status"
            :options="status_enum"
            :placeholder="$t('wms.goods.inventory.count.item.field.status_placeholder')"
            allow-clear
            style="width: 150px"
            @change="search"
          />
          <a-button @click="reset">
            <template #icon><icon-refresh /></template>
            <template #default>{{ $t('page.common.button.reset') }}</template>
          </a-button>
        </template>
        <template #toolbar-right>
          <!-- <a-button v-permission="['wms:goodsInventoryCountItem:add']" type="primary" @click="onAdd">
            <template #icon><icon-plus /></template>
            <template #default>{{ $t('page.common.button.add') }}</template>
          </a-button> -->
          <a-button v-permission="['wms:goodsInventoryCountItem:export']" @click="onExport">
            <template #icon><icon-download /></template>
            <template #default>{{ $t('page.common.button.export') }}</template>
          </a-button>
        </template>
        <template #action="{ record }">
          <a-space>
            <!-- <a-link v-permission="['wms:goodsInventoryCountItem:detail']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link> -->
            <a-link v-if="record.status === 1" v-permission="['wms:goodsInventoryCountItem:update']" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
            <a-link v-if="record.status === 1" v-permission="['wms:goodsInventoryCountItem:update']" @click="verifySuccess(record)">{{ $t('page.common.button.verify') }}</a-link>
            <a-link v-if="record.status === 2" v-permission="['wms:goodsInventoryCountItem:update']" @click="verifyCancel(record)">{{ $t('page.common.button.verifyCancel') }}</a-link>
            <!--
            <a-link
              v-permission="['wms:goodsInventoryCountItem:delete']"
              status="danger"
              :disabled="record.disabled"
              :title="record.disabled ? $t('page.common.button.disabledDelete') : $t('page.common.button.delete')"
              @click="onDelete(record)"
            >
              {{ $t('page.common.button.delete') }}
            </a-link> -->
          </a-space>
        </template>
      </GiTable>
    </a-card>

    <GoodsInventoryCountItemAddModal ref="GoodsInventoryCountItemAddModalRef" @save-success="search" />
    <GoodsInventoryCountItemDetailDrawer ref="GoodsInventoryCountItemDetailDrawerRef" />
  </div>
</template>

<style scoped lang="scss"></style>
