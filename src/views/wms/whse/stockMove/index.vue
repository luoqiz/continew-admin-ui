<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import WhseStockMoveAddModal from './WhseStockMoveAddModal.vue'
import WhseStockMoveDetailDrawer from './WhseStockMoveDetailDrawer.vue'
import { type WhseStockMoveQuery, type WhseStockMoveResp, deleteWhseStockMove, exportWhseStockMove, listWhseStockMove, updateWhseStockMoveStatus } from '@/apis/wms/whseStockMove'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useTable, useWhseAddr } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'WmsWhseStockMove' })
const { t } = useI18n()
const router = useRouter()

const { whseAddrOptions, loaded } = useWhseAddr()

const queryForm = reactive<WhseStockMoveQuery>({
  name: undefined,
  stockMoveNo: undefined,
  stockMoveType: undefined,
  stockInWhseId: undefined,
  stockOutWhseId: undefined,
  status: undefined,
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listWhseStockMove({ ...queryForm, ...page }), { immediate: false })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.whse.stock.move.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.whse.stock.move.field.name'), dataIndex: 'name', slotName: 'name' },
  { title: t('wms.whse.stock.move.field.stockMoveNo'), dataIndex: 'stockMoveNo', slotName: 'stockMoveNo' },
  // { title: t('wms.whse.stock.move.field.stockMoveType'), dataIndex: 'stockMoveType', slotName: 'stockMoveType' },
  { title: t('wms.whse.stock.move.field.stockOutWhseName'), dataIndex: 'stockOutWhseName', slotName: 'stockOutWhseId' },
  { title: t('wms.whse.stock.move.field.stockInWhseName'), dataIndex: 'stockInWhseName', slotName: 'stockInWhseId' },
  { title: t('wms.whse.stock.move.field.moveTime'), dataIndex: 'moveTime', slotName: 'moveTime' },
  { title: t('wms.whse.stock.move.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.whse.stock.move.field.stockInId'), dataIndex: 'stockInId', slotName: 'stockInId' },
  { title: t('wms.whse.stock.move.field.stockOutId'), dataIndex: 'stockOutId', slotName: 'stockOutId' },
  { title: t('wms.whse.stock.move.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.whse.stock.move.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.whse.stock.move.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },

  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockMove:update', 'wms:whseStockMove:delete']),
  },
])

// 仓库变更
const loadData = () => {
  if (!queryForm.stockOutWhseId || queryForm.stockOutWhseId?.length < 1) {
    const values = whseAddrOptions.value.map((item) => { return item.value })
    queryForm.stockOutWhseId = values[0]
  }
  search()
}

watch(loaded, () => {
  if (loaded.value) {
    loadData()
  }
}, { immediate: true })

// 重置
const reset = () => {
  queryForm.name = undefined
  queryForm.stockMoveNo = undefined
  queryForm.stockMoveType = undefined
  queryForm.stockInWhseId = undefined
  queryForm.stockOutWhseId = undefined
  queryForm.status = undefined
  loadData()
}

// 删除
const onDelete = (record: WhseStockMoveResp) => {
  return handleDelete(() => deleteWhseStockMove(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
// const onExport = () => {
//   useDownload(() => exportWhseStockMove(queryForm))
// }

const WhseStockMoveAddModalRef = ref<InstanceType<typeof WhseStockMoveAddModal>>()
// 新增
const onAdd = () => {
  WhseStockMoveAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: WhseStockMoveResp) => {
  WhseStockMoveAddModalRef.value?.onUpdate(record.id)
}

const WhseStockMoveDetailDrawerRef = ref<InstanceType<typeof WhseStockMoveDetailDrawer>>()
// 详情
const onDetail = (record: WhseStockMoveResp) => {
  // WhseStockMoveDetailDrawerRef.value?.onOpen(record.id)
  router.push({ path: '/wms/whse/stock/move/detail', query: { id: record.id } })
}

// 审核通过
const auditEvent = async (record: WhseStockMoveResp) => {
  const res = await updateWhseStockMoveStatus(record.id, 2)
  if (res.code === 0) {
    Message.success(t('page.common.message.modify.success'))
  }
  loadData()
}
</script>

<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.whse.stock.move.table')"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="pagination"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="loadData"
    >
      <template #status="{ record }">
        <span v-if="record.status === 1"> {{ $t('wms.whse.stock.move.state.s1') }}</span>
        <span v-if="record.status === 2"> {{ $t('wms.whse.stock.move.state.s2') }}</span>
        <span v-if="record.status === 3"> {{ $t('wms.whse.stock.move.state.s3') }}</span>
      </template>
      <template #toolbar-left>
        <a-input v-model="queryForm.name" :placeholder="$t('wms.whse.stock.move.field.name_placeholder')" allow-clear @change="loadData">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.stockMoveNo" :placeholder="$t('wms.whse.stock.move.field.stockMoveNo_placeholder')" allow-clear @change="loadData">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-input v-model="queryForm.stockMoveType" placeholder="请输入出库类型" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <!-- <a-input v-model="queryForm.stockInWhseId" placeholder="请输入入仓id编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.stockOutWhseId" placeholder="请输入出仓id编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <CustomWhseSelect v-model="queryForm.stockOutWhseId" style="width:240px" :placeholder="$t('wms.whse.stock.move.field.stockOutWhseId_placeholder')" :options="whseAddrOptions" @change="loadData"></CustomWhseSelect>
        <CustomWhseSelect v-model="queryForm.stockInWhseId" style="width:240px" :placeholder="$t('wms.whse.stock.move.field.stockInWhseId_placeholder')" :options="whseAddrOptions" @change="loadData"></CustomWhseSelect>
        <!-- <a-input v-model="queryForm.status" placeholder="请输入状态" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:whseStockMove:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <!-- <a-button v-permission="['wms:whseStockMove:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button> -->
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:whseStockMove:detail']" :title="$t('page.common.button.detail')" @click="onDetail(record)">{{ $t('page.common.button.detail') }}</a-link>
          <a-link v-if="record.status === 1" v-permission="['wms:whseStockMove:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link v-if="record.status === 1" v-permission="['wms:whseStockMove:adult']" :title="$t('page.common.button.audit')" @click="auditEvent(record)">{{ $t('page.common.button.audit') }}</a-link>
          <a-link
            v-if="record.status === 1"
            v-permission="['wms:whseStockMove:delete']"
            status="danger"
            :disabled="record.disabled"
            @click="onDelete(record)"
          >
            {{ record.disabled ? $t('page.common.button.disabledDelete') : $t('page.common.button.delete') }}
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <WhseStockMoveAddModal ref="WhseStockMoveAddModalRef" @save-success="loadData" />
    <WhseStockMoveDetailDrawer ref="WhseStockMoveDetailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
