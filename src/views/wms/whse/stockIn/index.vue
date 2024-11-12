<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.stock.in.title')"
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
        <a-input v-model="queryForm.whseId" placeholder="请输入仓库id编号" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
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
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:whseStockIn:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['wms:whseStockIn:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>导出</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:whseStockIn:list']" title="查看" @click="onDetail(record)">查看</a-link>
          <span v-if="record.status === 1">
            <a-link v-permission="['wms:whseStockIn:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          </span>
          <a-link
            v-permission="['wms:whseStockIn:delete']"
            status="danger"
            :disabled="record.disabled"
            title="删除"
            @click="onDelete(record)"
          >
            删除
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <WhseStockInAddModal ref="WhseStockInAddModalRef" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import WhseStockInAddModal from './WhseStockInAddModal.vue'
import { type WhseStockInQuery, type WhseStockInResp, deleteWhseStockIn, exportWhseStockIn, listWhseStockIn } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

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
const columns: ComputedRef<TableInstanceColumns[]> = computed(() =>
  [
  // { title: 'id编号', dataIndex: 'id', slotName: 'id' },
    { title: t('wms.whse.stock.in.table.filed.name'), dataIndex: 'name', slotName: 'name' },
    { title: '入库单号', dataIndex: 'stockInNo', slotName: 'stockInNo' },
    { title: '仓库名称', dataIndex: 'whseName', slotName: 'whseName' },
    { title: '关联移库单号', dataIndex: 'stockMoveId', slotName: 'stockMoveId' },
    { title: '入库时间', dataIndex: 'inTime', slotName: 'inTime' },
    { title: '状态', dataIndex: 'status', slotName: 'status' },
    { title: '备注信息', dataIndex: 'memo', slotName: 'memo' },
    { title: '创建人', dataIndex: 'createUserString', slotName: 'createUser' },
    { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
    {
      title: '操作',
      slotName: 'action',
      width: 260,
      align: 'center',
      fixed: !isMobile() ? 'right' : undefined,
      show: has.hasPermOr(['wms:whseStockIn:update', 'wms:whseStockIn:delete']),
    },
  ],
)

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
    content: `是否确定删除该条数据？`,
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

const onDetail = (record: WhseStockInResp) => {
  router.push({ path: '/wms/whse/stockIn/detail', query: { id: record.id } })
}
</script>

<style lang="scss" scoped></style>
