<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.whse.addr.table')"
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
        <span v-if="record.status === 1">{{ $t('wms.whse.addr.status.s1') }}</span>
        <span v-if="record.status === 2">{{ $t('wms.whse.addr.status.s2') }}</span>
        <span v-if="record.status === 3">{{ $t('wms.whse.addr.status.s3') }}</span>
      </template>
      <template #toolbar-left>
        <a-input v-model="queryForm.whseNo" :placeholder="$t('wms.whse.addr.field.whseNo')" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.name" :placeholder="$t('wms.whse.addr.field.name')" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-input v-model="queryForm.status" placeholder="请输入状态 (1使用  2停用)" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input> -->
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:whseAddr:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-button v-permission="['wms:whseAddr:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>{{ $t('page.common.button.export') }}</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <!-- <a-link v-permission="['wms:whseAddr:detail']" @click="onDetail(record)">{{ $t('page.common.button.detail') }}</a-link> -->
          <a-link v-permission="['wms:whseAddr:update']" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link
            v-permission="['wms:whseAddr:delete']"
            status="danger"
            :disabled="record.disabled"
            @click="onDelete(record)"
          >
            {{ record.disabled ? $t('page.common.button.disabledDelete') : $t('page.common.button.delete') }}
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <AddrAddModal ref="AddrAddModalRef" @save-success="search" />
    <AddrDetailDrawer ref="AddrDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AddrAddModal from './AddrAddModal.vue'
import AddrDetailDrawer from './AddrDetailDrawer.vue'
import { type AddrResp, type WhseAddrQuery, deleteAddr, exportAddr, listAddrRegion, listAddrStore } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'WmsWhseCountry' })

const { t } = useI18n()

const queryForm = reactive<WhseAddrQuery>({
  whseNo: undefined,
  whseType: 2,
  name: undefined,
  status: undefined,
  sort: ['createTime,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listAddrStore({ ...queryForm, ...page }), { immediate: true })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.whse.addr.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.whse.addr.field.whseNo'), dataIndex: 'whseNo', slotName: 'whseNo' },
  { title: t('wms.whse.addr.field.name'), dataIndex: 'name', slotName: 'name' },
  { title: t('wms.whse.addr.field.addr'), dataIndex: 'addr', slotName: 'addr' },
  //  { title: t('wms.whse.addr.field.whseType'), dataIndex: 'whseType', slotName: 'whseType' },
  { title: t('wms.whse.addr.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.whse.addr.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.whse.addr.field.deptId'), dataIndex: 'deptName', slotName: 'deptId' },
  { title: t('wms.whse.addr.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.whse.addr.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  // { title: t('wms.whse.addr.field.updateUser'), dataIndex: 'updateUser', slotName: 'updateUser' },
  // { title: t('wms.whse.addr.field.updateTime'), dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 180,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:whseAddr:detail', 'wms:whseAddr:update', 'wms:whseAddr:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.whseNo = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: AddrResp) => {
  return handleDelete(() => deleteAddr(record.id), {
    content: t('page.common.message.delete'),
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportAddr(queryForm))
}

const AddrAddModalRef = ref<InstanceType<typeof AddrAddModal>>()
// 新增
const onAdd = () => {
  AddrAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: AddrResp) => {
  AddrAddModalRef.value?.onUpdate(record.id)
}

const AddrDetailDrawerRef = ref<InstanceType<typeof AddrDetailDrawer>>()
// 详情
// const onDetail = (record: AddrResp) => {
//   AddrDetailDrawerRef.value?.onDetail(record.id)
// }
</script>

<style lang="scss" scoped></style>
