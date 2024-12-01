<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type GoodsStockQuery, type GoodsStockResp, addWhseStockOutDetail, deleteGoodsStock, exportGoodsStock, listGoodsStock } from '@/apis/wms'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useTable } from '@/hooks'

defineOptions({ name: 'WmsGoodsStock' })
const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()

const visible = ref<boolean>(false)

const stockOutModalVisible = ref<boolean>(false)

const stockOutIdRef = ref()

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
  // { title: t('wms.goods.stock.field.whseType'), dataIndex: 'whseType', slotName: 'whseType' },
  // { title: t('wms.goods.stock.field.whseId'), dataIndex: 'whseId', slotName: 'whseId' },
  { title: t('wms.goods.stock.field.whseName'), dataIndex: 'whseName', slotName: 'whseId' },
  // { title: t('wms.goods.stock.field.status'), dataIndex: 'status', slotName: 'status' },
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
  stockOutIdRef.value = stockOutId
  search()
}

const stockOutNum = ref(0)

const goodsInfo = ref()

const handleClick = (record: any) => {
  stockOutModalVisible.value = true
  stockOutNum.value = record.realNum
  goodsInfo.value = record
}
const handleBeforeOk = async (done) => {
  const body = {
    stockOutId: stockOutIdRef.value,
    goodsStockId: goodsInfo.value.id,
    goodsSku: goodsInfo.value.goodsSku,
    goodsName: goodsInfo.value.goodsName,
    prodTime: goodsInfo.value.prodTime,
    expiryTime: goodsInfo.value.expiryTime,
    planNum: stockOutNum.value,
  }
  await addWhseStockOutDetail(body)
  stockOutModalVisible.value = false
  stockOutNum.value = 0
  search()
  emit('save-success')
}
const handleCancel = () => {
  stockOutNum.value = 0
  stockOutModalVisible.value = false
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
        <template #initNum="{ record }">
          <span v-if="record?.whseType === 1">
            {{ record.initNum }}  {{ record.goodsUnit }}
          </span>
          <span v-else>
            {{ record.initNum ? `${record.initNum} ${record.goodsPackUnit}` : "" }}
          </span>
        </template>
        <template #realNum="{ record }">
          <span v-if="record?.whseType === 1">
            {{ record.realNum }}  {{ record.goodsUnit }}
          </span>
          <span v-else>
            {{ record.realNum ? `${record.realNum} ${record.goodsPackUnit}` : "" }}
          </span>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-link :title="$t('page.common.button.checkout')" @click="handleClick(record)">{{ $t('wms.whse.stock.out.button.stockOut') }}</a-link>
          </a-space>
        </template>
      </GiTable>
    </a-modal>
    <a-modal v-model:visible="stockOutModalVisible" :title="$t('wms.whse.stock.out.message.stockOutNum')" @cancel="handleCancel" @before-ok="handleBeforeOk">
      <a-form-item>
        <a-input-number v-model="stockOutNum" :max="stockOutNum" :min="1" />
      </a-form-item>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped></style>
