<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import WhseStockInAddModal from './WhseStockInAddModal.vue'
import { type WhseStockInQuery, type WhseStockInResp, deleteWhseStockIn, exportWhseStockIn, listWhseStockIn, updateWhseStockIn, updateWhseStockInStatus } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'
import CustomWhseSelect from '@/components/WhseSelect/index.vue'

defineOptions({ name: 'WmsWhseStockIn' })

const { t } = useI18n()

const router = useRouter()

const queryForm = reactive<WhseStockInQuery>({
  name: undefined,
  stockInNo: undefined,
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
} = useTable((page) => listWhseStockIn({ ...queryForm, ...page }), { immediate: true })

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
const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.whse.stock.in.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.whse.stock.in.field.name'), dataIndex: 'name', slotName: 'name' },
  { title: t('wms.whse.stock.in.field.stockInNo'), dataIndex: 'stockInNo', slotName: 'stockInNo' },
  // { title: t('wms.whse.stock.in.field.whseId'), dataIndex: 'whseId', slotName: 'whseId' },
  { title: t('wms.whse.stock.in.field.whseName'), dataIndex: 'whseName', slotName: 'whseName' },
  { title: t('wms.whse.stock.in.field.stockMoveId'), dataIndex: 'stockMoveId', slotName: 'stockMoveId' },
  { title: t('wms.whse.stock.in.field.inTime'), dataIndex: 'inTime', slotName: 'inTime' },
  { title: t('wms.whse.stock.in.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.whse.stock.in.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.whse.stock.in.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.whse.stock.in.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseStockIn:update', 'wms:whseStockIn:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.name = undefined
  queryForm.stockInNo = undefined
  queryForm.whseId = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: WhseStockInResp) => {
  return handleDelete(() => deleteWhseStockIn(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportWhseStockIn(queryForm))
}

const WhseStockInAddModalRef = ref<InstanceType<typeof WhseStockInAddModal>>()
// 新增
const onAdd = () => {
  WhseStockInAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: WhseStockInResp) => {
  WhseStockInAddModalRef.value?.onUpdate(record.id)
}

// 查看，跳转到详情页
const onDetail = (record: WhseStockInResp) => {
  router.push({ path: '/wms/whse/stockIn/detail', query: { id: record.id } })
}
// 审核通过
const auditEvent = async (record: WhseStockInResp) => {
  const res = await updateWhseStockInStatus(record.id, 2)
  if (res.success) {
    Message.success(t('page.common.message.modify.success'))
    search()
  }
}
</script>

<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.whse.stock.in.table')"
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
        <span v-if="record.status === 1"> {{ $t('wms.whse.stock.in.state.s1') }}</span>
        <span v-if="record.status === 2"> {{ $t('wms.whse.stock.in.state.s2') }}</span>
        <span v-if="record.status === 3"> {{ $t('wms.whse.stock.in.state.s3') }}</span>
      </template>
      <template #toolbar-left>
        <a-input v-model="queryForm.name" placeholder="请输入入库名称" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.stockInNo" placeholder="请输入入库单号" allow-clear @change="search">
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
        <a-button v-permission="['wms:whseStockIn:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['wms:whseStockIn:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <div v-if="record.status === 1">
            <a-link v-permission="['wms:whseStockIn:list']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
            <a-link v-permission="['wms:whseStockIn:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
            <a-link v-permission="['wms:whseStockIn:update']" :title="$t('page.common.button.audit')" @click="auditEvent(record)">{{ $t('page.common.button.audit') }}</a-link>
            <a-link
              v-permission="['wms:whseStockIn:delete']"
              status="danger"
              :disabled="record.disabled"
              :title="$t('page.common.button.delete')"
              @click="onDelete(record)"
            >
              {{ $t('page.common.button.delete') }}
            </a-link>
          </div>
          <div v-if="record.status === 2 || record.status === 3">
            <a-link v-permission="['wms:whseStockIn:list']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
          </div>
        </a-space>
      </template>
    </GiTable>

    <WhseStockInAddModal ref="WhseStockInAddModalRef" @save-success="search" />
  </div>
</template>

<style lang="scss" scoped></style>
