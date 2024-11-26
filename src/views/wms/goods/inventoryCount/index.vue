<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.goods.inventory.count.table')"
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
        <span v-if="record.status === 1">{{ $t('wms.goods.inventory.count.status.s1') }}</span>
        <span v-if="record.status === 2">{{ $t('wms.goods.inventory.count.status.s2') }}</span>
        <span v-if="record.status === 3">{{ $t('wms.goods.inventory.count.status.s3') }}</span>
      </template>
      <template #toolbar-left>
        <a-input v-model="queryForm.name" :placeholder="$t('wms.goods.inventory.count.field.name_placeholder')" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-input v-model="queryForm.whseId" placeholder="请输入仓库id" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <CustomWhseSelect
          v-model="queryForm.whseId"
          style="width:240px"
          :options="whseAddrOptions"
          :placeholder="$t('wms.whse.select_placeholder')"
          @change="loadData"
        ></CustomWhseSelect>
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
        <a-button v-permission="['wms:goodsInventoryCount:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['wms:goodsInventoryCount:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['wms:goodsInventoryCount:detail']" :title="$t('page.common.button.checkout')" @click="onDetail(record)">{{ $t('page.common.button.checkout') }}</a-link>
          <a-link v-permission="['wms:goodsInventoryCount:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link
            v-permission="['wms:goodsInventoryCount:delete']"
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

    <GoodsInventoryCountAddModal ref="GoodsInventoryCountAddModalRef" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GoodsInventoryCountAddModal from './GoodsInventoryCountAddModal.vue'
import GoodsInventoryCountDetailDrawer from './GoodsInventoryCountDetailDrawer.vue'
import { type GoodsInventoryCountQuery, type GoodsInventoryCountResp, deleteGoodsInventoryCount, exportGoodsInventoryCount, listGoodsInventoryCount } from '@/apis/wms/goodsInventoryCount'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable, useWhseAddr } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'GoodsInventoryCount' })
const { t } = useI18n()
const { whseAddrOptions } = useWhseAddr()
const router = useRouter()

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

const queryForm = reactive<GoodsInventoryCountQuery>({
  name: undefined,
  whseId: undefined,
  status: undefined,
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listGoodsInventoryCount({ ...queryForm, ...page }), { immediate: true })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.goods.inventory.count.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.goods.inventory.count.field.name'), dataIndex: 'name', slotName: 'name' },
  { title: t('wms.goods.inventory.count.field.whseId'), dataIndex: 'whseName', slotName: 'whseId' },
  { title: t('wms.goods.inventory.count.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.goods.inventory.count.field.startTime'), dataIndex: 'startTime', slotName: 'startTime' },
  { title: t('wms.goods.inventory.count.field.endTime'), dataIndex: 'endTime', slotName: 'endTime' },
  { title: t('wms.goods.inventory.count.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.goods.inventory.count.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.goods.inventory.count.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  // { title: t('wms.goods.inventory.count.field.updateUser'), dataIndex: 'updateUserString', slotName: 'updateUser' },
  // { title: t('wms.goods.inventory.count.field.updateTime'), dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:goodsInventoryCount:detail', 'wms:goodsInventoryCount:update', 'wms:goodsInventoryCount:delete']),
  },
])

// 仓库变更
const loadData = () => {
  if (!queryForm.whseId || queryForm.whseId?.length < 1) {
    const values = whseAddrOptions.value.map((item) => { return item.value })
    // queryForm.whseId = whseAddrOptions ?? whseAddrOptions.value[0].value
    queryForm.whseId = values[0]
  }
  search()
}

// 重置
const reset = () => {
  queryForm.name = undefined
  queryForm.whseId = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: GoodsInventoryCountResp) => {
  return handleDelete(() => deleteGoodsInventoryCount(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportGoodsInventoryCount(queryForm))
}

const GoodsInventoryCountAddModalRef = ref<InstanceType<typeof GoodsInventoryCountAddModal>>()
// 新增
const onAdd = () => {
  GoodsInventoryCountAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: GoodsInventoryCountResp) => {
  GoodsInventoryCountAddModalRef.value?.onUpdate(record.id)
}

// 详情
const onDetail = (record: GoodsInventoryCountResp) => {
  router.push({ path: '/wms/goods/inventoryCountItem', query: { id: record.id } })
}
</script>

<style scoped lang="scss"></style>
