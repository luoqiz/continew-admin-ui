<script setup lang="ts">
import JsBarcode from 'jsbarcode'
import { VuePrintNext, vPrint } from 'vue-print-next'
import { useI18n } from 'vue-i18n'
import QrcodeVue from 'qrcode.vue'
import GoodsSkuAddModal from './GoodsSkuAddModal.vue'
import GoodsSkuDetailDrawer from './GoodsSkuDetailDrawer.vue'
import { type GoodsSkuQuery, type GoodsSkuResp, deleteGoodsSku, exportGoodsSku, listGoodsSku } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'GoodsSku' })

const { t } = useI18n()
const qrcode = ref('')
const barcodeRef = ref(null)

const printBarcode = () => {
  new VuePrintNext({ el: '#barcodeEle' /** 其他参数 */ })
}

const printQrcode = async (text: string) => {
  qrcode.value = text

  setTimeout(() => {
    new VuePrintNext({ el: '#qrcodeEle' /** 其他参数 */ })
  }, 1000)
}

const createBarcode = (text: string) => {
  const options = {
  // format: 'EAN13', // 格式
    height: 50,
    // text: "覆盖显示的文本",
    fontSize: 16,
    // background: '#ccc',
    lineColor: 'black',
  }
  JsBarcode(barcodeRef.value, text, options)
  printBarcode()
}

const queryForm = reactive<GoodsSkuQuery>({
  barcode: undefined,
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
} = useTable((page) => listGoodsSku({ ...queryForm, ...page }), { immediate: true })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  { title: t('wms.goods.sku.field.name'), dataIndex: 'name', slotName: 'name' },
  //  { title: t('wms.goods.sku.field.id'), dataIndex: 'id', slotName: 'id' },
  { title: t('wms.goods.sku.field.barcode'), dataIndex: 'barcode', slotName: 'barcode' },
  //   { title: t('wms.goods.sku.field.spuId'), dataIndex: 'spuId', slotName: 'spuId' },
  { title: t('wms.goods.sku.field.unit'), dataIndex: 'unit', slotName: 'unit' },
  { title: t('wms.goods.sku.field.amount'), dataIndex: 'amount', slotName: 'amount' },
  { title: t('wms.goods.sku.field.unpacking'), dataIndex: 'unpacking', slotName: 'unpacking' },
  { title: t('wms.goods.sku.field.packUnit'), dataIndex: 'packUnit', slotName: 'packUnit' },
  { title: t('wms.goods.sku.field.packAmount'), dataIndex: 'packAmount', slotName: 'packAmount' },
  // { title: t('wms.goods.sku.field.sellPoint'), dataIndex: 'sellPoint', slotName: 'sellPoint' },
  // { title: t('wms.goods.sku.field.specs'), dataIndex: 'specs', slotName: 'specs' },
  { title: t('wms.goods.sku.field.price'), dataIndex: 'price', slotName: 'price' },
  // { title: t('wms.goods.sku.field.img'), dataIndex: 'img', slotName: 'img' },
  // { title: t('wms.goods.sku.field.pics'), dataIndex: 'pics', slotName: 'pics' },
  // { title: t('wms.goods.sku.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.goods.sku.field.memo'), dataIndex: 'memo', slotName: 'memo' },
  { title: t('wms.goods.sku.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.goods.sku.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  // { title: t('wms.goods.sku.field.updateUser'), dataIndex: 'updateUser', slotName: 'updateUser' },
  // { title: t('wms.goods.sku.field.updateTime'), dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 220,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['wms:goodsSku:detail', 'wms:goodsSku:update', 'wms:goodsSku:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.barcode = undefined
  queryForm.name = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: GoodsSkuResp) => {
  return handleDelete(() => deleteGoodsSku(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

// 导出
// const onExport = () => {
//   useDownload(() => exportGoodsSku(queryForm))
// }

const GoodsSkuAddModalRef = ref<InstanceType<typeof GoodsSkuAddModal>>()
// 新增
const onAdd = () => {
  GoodsSkuAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: GoodsSkuResp) => {
  GoodsSkuAddModalRef.value?.onUpdate(record.id)
}

const GoodsSkuDetailDrawerRef = ref<InstanceType<typeof GoodsSkuDetailDrawer>>()
// 详情
// const onDetail = (record: GoodsSkuResp) => {
//   GoodsSkuDetailDrawerRef.value?.onDetail(record.id)
// }
</script>

<template>
  <div class="table-page">
    <GiTable
      row-key="id"
      :title="$t('wms.goods.sku.table')"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="pagination"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="search"
    >
      <template #unpacking="{ record }">
        <sapn v-if="record.unpacking">
          {{ $t('page.common.field.true') }}
        </sapn>
        <sapn v-else>
          {{ $t('page.common.field.false') }}
        </sapn>
      </template>
      <template #toolbar-left>
        <a-input v-model="queryForm.barcode" :placeholder="$t('wms.goods.sku.field.barcode_placeholder')" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <a-input v-model="queryForm.name" :placeholder="$t('wms.goods.sku.field.name_placeholder')" allow-clear @change="search">
          <template #prefix><icon-search /></template>
        </a-input>
        <!-- <a-radio-group v-model="queryForm.status" :options="" @change="search" /> -->
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['wms:goodsSku:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <!-- <a-button v-permission="['wms:goodsSku:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>导出</template>
        </a-button> -->
      </template>
      <template #action="{ record }">
        <a-space>
          <!-- <a-link v-permission="['wms:goodsSku:detail']" @click="onDetail(record)"> {{ $t('page.common.button.detail') }}</a-link> -->
          <a-link @click="createBarcode(record.barcode)"> {{ $t('wms.goods.sku.printBarcode') }}</a-link>
          <a-link @click="printQrcode(record.barcode)"> {{ $t('wms.goods.sku.printQrcode') }}</a-link>
          <a-link v-permission="['wms:goodsSku:update']" @click="onUpdate(record)"> {{ $t('page.common.button.modify') }}</a-link>
          <a-link
            v-permission="['wms:goodsSku:delete']"
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

    <GoodsSkuAddModal ref="GoodsSkuAddModalRef" @save-success="search" />
    <GoodsSkuDetailDrawer ref="GoodsSkuDetailDrawerRef" />
    <div v-show="false">
      <div id="barcodeEle">
        <svg ref="barcodeRef"></svg>
      </div>
    </div>
    <div v-show="false">
      <div id="qrcodeEle">
        <QrcodeVue :value="qrcode" :size="size" level="H" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
