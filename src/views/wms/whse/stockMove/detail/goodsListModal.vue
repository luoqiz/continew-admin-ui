<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type GoodsStockQuery, type GoodsStockResp, addWhseStockMoveDetail, addWhseStockOutDetail, deleteGoodsStock, exportGoodsStock, listGoodsStock } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'WmsGoodsStock' })
const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()

const visible = ref<boolean>(false)

const stockMoveModalVisible = ref<boolean>(false)

const stockMoveIdRef = ref()

const queryForm = reactive<GoodsStockQuery>({
  stockInId: undefined,
  stockInNo: undefined,
  stockInDetailId: undefined,
  goodsId: undefined,
  goodsSku: undefined,
  whseType: undefined,
  whseId: undefined,
  status: undefined,
  prodTime: undefined,
  expiryTime: undefined,
  sort: ['createTime,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
} = useTable((page) => listGoodsStock({ ...queryForm, ...page }), { immediate: false })

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  // { title: t('wms.goods.stock.field.id'), dataIndex: 'id', slotName: 'id' },
  // { title: t('wms.goods.stock.field.stockInId'), dataIndex: 'stockInId', slotName: 'stockInId' },

  // { title: t('wms.goods.stock.field.stockInDetailId'), dataIndex: 'stockInDetailId', slotName: 'stockInDetailId' },
  // { title: t('wms.goods.stock.field.goodsId'), dataIndex: 'goodsId', slotName: 'goodsId' },
  { title: t('wms.goods.stock.field.goodsName'), dataIndex: 'goodsName', slotName: 'goodsName' },
  { title: t('wms.goods.stock.field.goodsSku'), dataIndex: 'goodsSku', slotName: 'goodsSku' },
  { title: t('wms.goods.stock.field.stockInNo'), dataIndex: 'stockInNo', slotName: 'stockInNo' },
  { title: t('wms.goods.stock.field.initNum'), dataIndex: 'initNum', slotName: 'initNum' },
  { title: t('wms.goods.stock.field.realNum'), dataIndex: 'realNum', slotName: 'realNum' },
  { title: t('wms.goods.stock.field.whseType'), dataIndex: 'whseType', slotName: 'whseType' },
  // { title: t('wms.goods.stock.field.whseId'), dataIndex: 'whseId', slotName: 'whseId' },
  { title: t('wms.goods.stock.field.whseName'), dataIndex: 'whseName', slotName: 'whseId' },
  { title: t('wms.goods.stock.field.status'), dataIndex: 'status', slotName: 'status' },
  { title: t('wms.goods.stock.field.prodTime'), dataIndex: 'prodTime', slotName: 'prodTime' },
  { title: t('wms.goods.stock.field.expiryTime'), dataIndex: 'expiryTime', slotName: 'expiryTime' },
  { title: t('wms.goods.stock.field.info'), dataIndex: 'info', slotName: 'info' },
  { title: t('wms.goods.stock.field.createUser'), dataIndex: 'createUserString', slotName: 'createUser' },
  { title: t('wms.goods.stock.field.createTime'), dataIndex: 'createTime', slotName: 'createTime' },
  // { title: t('wms.goods.stock.field.updateUser'), dataIndex: 'updateUserString', slotName: 'updateUser' },
  // { title: t('wms.goods.stock.field.updateTime'), dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: t('page.common.button.operator'),
    slotName: 'action',
    dataIndex: 'action',
    width: 130,
    // align: 'center',
    // fixed: !isMobile() ? 'right' : undefined,
    // show: has.hasPermOr(['wms:goodsStock:update', 'wms:goodsStock:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.stockInId = undefined
  queryForm.stockInNo = undefined
  queryForm.stockInDetailId = undefined
  queryForm.goodsId = undefined
  queryForm.goodsSku = undefined
  queryForm.whseType = undefined
  queryForm.whseId = undefined
  queryForm.status = undefined
  queryForm.prodTime = undefined
  queryForm.expiryTime = undefined
  search()
}

// 新增
const show = (whseId: string, stockOutId: string) => {
  visible.value = true
  queryForm.whseId = whseId
  stockMoveIdRef.value = stockOutId
  search()
}

const stockMoveNum = ref(0)

const goodsInfo = ref()

// 出库按钮
const handleClick = (record: any) => {
  stockMoveModalVisible.value = true
  stockMoveNum.value = record.realNum
  goodsInfo.value = record
}

const handleBeforeOk = async () => {
  const body = {
    stockMoveId: stockMoveIdRef.value,
    goodsStockId: goodsInfo.value.id,
    goodsSku: goodsInfo.value.goodsSku,
    goodsName: goodsInfo.value.goodsName,
    prodTime: goodsInfo.value.prodTime,
    expiryTime: goodsInfo.value.expiryTime,
    planNum: stockMoveNum.value,
  }
  await addWhseStockMoveDetail(body)
  stockMoveModalVisible.value = false
  stockMoveNum.value = 0
  search()
  emit('save-success')
}
const handleCancel = () => {
  stockMoveNum.value = 0
  stockMoveModalVisible.value = false
  emit('save-success')
}

defineExpose({ show })
</script>

<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :mask-closable="false"
      :esc-to-close="false"
      width="90%"
      @close="reset"
    >
      <!-- @before-ok="save" -->
      <GiTable
        row-key="id"
        :title="$t('wms.goods.stock.table')"
        :data="dataList"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
        :pagination="pagination"
        :disabled-tools="['size']"
        :disabled-column-keys="['name']"
        @refresh="search"
      >
        <template #action="{ record }">
          <a-space>
            <a-link :title="$t('page.common.button.checkout')" @click="handleClick(record)">{{ $t('wms.whse.stock.out.button.stockOut') }}</a-link>
          </a-space>
        </template>
      </GiTable>
    </a-modal>
    <a-modal v-model:visible="stockMoveModalVisible" :title="$t('wms.whse.stock.out.message.stockOutNum')" @cancel="handleCancel" @before-ok="handleBeforeOk">
      <a-form-item>
        <a-input-number v-model="stockMoveNum" :max="stockMoveNum" :min="1" />
      </a-form-item>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped></style>
