<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import WhseStockOutAddModal from './WhseStockOutAddModal.vue'
import WhseStockOutDetailDrawer from './WhseStockOutDetailDrawer.vue'
import { type WhseStockOutQuery, type WhseStockOutResp, deleteWhseStockOut, exportWhseStockOut, listWhseStockOut, updateWhseStockOutStatus } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'WmsWhseStockOut' })
const { t } = useI18n()
const router = useRouter()

const status_enum = computed(() => [{
  value: '1',
  label: t('wms.whse.stock.out.state.s1'),
  other: 'extra',
}, {
  value: '2',
  label: t('wms.whse.stock.out.state.s2'),
  other: 'extra',
}, {
  value: '3',
  label: t('wms.whse.stock.out.state.s3'),
  other: 'extra',
}])

const queryForm = reactive<WhseStockOutQuery>({
  name: undefined,
  stockOutNo: undefined,
  whseId: undefined,
  status: undefined,
  sort: ['createTime,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listWhseStockOut({ ...queryForm, ...page }), { immediate: true })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  { title: t('wms.whse.stock.out.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.whse.stock.out.field.name'), dataIndex: 'name', slotName: 'name' },
  { title: t('wms.whse.stock.out.field.stockOutNo'), dataIndex: 'stockOutNo', slotName: 'stockOutNo' },
  { title: t('wms.whse.stock.out.field.stockOutType'), dataIndex: 'stockOutType', slotName: 'stockOutType' },
  // { title: t('wms.whse.stock.out.field.whseId'), dataIndex: 'whseId', slotName: 'whseId' },
  { title: t('wms.whse.stock.out.field.whseName'), dataIndex: 'whseName', slotName: 'whseName' },
  { title: t('wms.whse.stock.out.field.whseAreaId'), dataIndex: 'whseAreaId', slotName: 'whseAreaId' },
  { title: t('wms.whse.stock.out.field.stockMoveId'), dataIndex: 'stockMoveId', slotName: 'stockMoveId' },
  { title: t('wms.whse.stock.out.field.outTime'), dataIndex: 'outTime', slotName: 'outTime' },
  { title: t('wms.whse.stock.out.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.whse.stock.out.field.createUser'), dataIndex: 'createUser', slotName: 'createUser' },
  { title: t('wms.whse.stock.out.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    dataIndex: 'action',
    width: 200,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockOut:update', 'wms:whseStockOut:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.name = undefined
  queryForm.stockOutNo = undefined
  queryForm.whseId = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: WhseStockOutResp) => {
  return handleDelete(() => deleteWhseStockOut(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportWhseStockOut(queryForm))
}

const WhseStockOutAddModalRef = ref<InstanceType<typeof WhseStockOutAddModal>>()
// 新增
const onAdd = () => {
  WhseStockOutAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: WhseStockOutResp) => {
  WhseStockOutAddModalRef.value?.onUpdate(record.id)
}

const WhseStockOutDetailDrawerRef = ref<InstanceType<typeof WhseStockOutDetailDrawer>>()

// 查看，跳转到详情页
const onDetail = (record: WhseStockOutResp) => {
  router.push({ path: '/wms/whse/stockOut/detail', query: { id: record.id } })
}

// 审核通过
const auditEvent = async (record: WhseStockOutResp) => {
  const res = await updateWhseStockOutStatus(record.id, 2)
  if (res.code === 0) {
    Message.success(t('page.common.message.modify.success'))
  }
  search()
}
</script>

<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.whse.stock.out.table')"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="pagination"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="search"
    >
      <template #status="{ record }">
        <span v-if="record.status === 1"> {{ $t('wms.whse.stock.out.state.s1') }}</span>
        <span v-if="record.status === 2"> {{ $t('wms.whse.stock.out.state.s2') }}</span>
        <span v-if="record.status === 3"> {{ $t('wms.whse.stock.out.state.s3') }}</span>
      </template>
      <template #toolbar-left>
        {{ queryForm.whseId }}
        <a-input v-model="queryForm.name" placeholder="请输入出库名称" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.stockOutNo" placeholder="请输入出库单号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-input v-model="queryForm.whseId" placeholder="请输入仓库id编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <CustomWhseSelect v-model="queryForm.whseId" style="width:240px" placeholder="请选择仓库" @change="search"></CustomWhseSelect>
        <a-select
          v-model="queryForm.status"
          :options="status_enum"
          placeholder="请选择状态"
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
        <a-button v-permission="['wms:whseStockOut:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['wms:whseStockOut:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:whseStockOut:list']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
          <a-link v-if="record.status === 1" v-permission="['wms:whseStockOut:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link v-if="record.status === 1" v-permission="['wms:whseStockIn:update']" :title="$t('page.common.button.audit')" @click="auditEvent(record)">{{ $t('page.common.button.audit') }}</a-link>
          <a-link
            v-if="record.status === 1"
            v-permission="['wms:whseStockOut:delete']"
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

    <WhseStockOutAddModal ref="WhseStockOutAddModalRef" @save-success="search" />
    <WhseStockOutDetailDrawer ref="WhseStockOutDetailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
