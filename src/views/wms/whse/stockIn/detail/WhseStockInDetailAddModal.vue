<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :modal-style="{ maxWidth: '520px' }"
    width="90%"
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { addWhseStockInDetail, getWhseStockInDetail, updateWhseStockInDetail } from '@/apis/wms/whseStockInDetail'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'
import { getGoodsSkuBySkuNo, listGoodsSku } from '@/apis/wms'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.whse.stock.in.detail.page.modify.title') : t('wms.whse.stock.in.detail.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()

const options: Options = {
  form: {},
  btns: { hide: true },
}

const { form, resetForm } = useForm({
  // todo 待补充
})

const columns = computed<Columns<typeof form>>(() => [
  {
    label: t('wms.whse.stock.in.detail.field.stockInId'),
    field: 'stockInId',
    type: 'input',
    props: {
      disabled: true,
    },
    rules: [{ required: true, message: t('wms.whse.stock.in.detail.field.stockInId_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.detail.field.goodsSku'),
    field: 'goodsSku',
    type: 'input',
    events: {
      change: async (value: string, _ev: Event) => {
        const skuInfo = await getGoodsSkuBySkuNo(value)
        if (skuInfo.success && skuInfo.data.id) {
          form.goodsName = skuInfo.data.name
        } else {
          Message.error('请输入正确的sku')
        }
      },
    },
    rules: [{ required: true, message: t('wms.whse.stock.in.detail.field.goodsSku_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.detail.field.goodsName'),
    field: 'goodsName',
    type: 'input',
    props: {
      disabled: true,
    },
    rules: [{ required: true, message: t('wms.whse.stock.in.detail.field.goodsName_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.detail.field.prodTime'),
    field: 'prodTime',
    type: 'date-picker',
    rules: [{ required: true, message: t('wms.whse.stock.in.detail.field.prodTime_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.detail.field.expiryTime'),
    field: 'expiryTime',
    type: 'date-picker',
    rules: [{ required: true, message: t('wms.whse.stock.in.detail.field.expiryTime_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.detail.field.planNum'),
    field: 'planNum',
    type: 'input-number',
    props: {
      disabled: isUpdate.value,
    },
    rules: [{ required: true, message: t('wms.whse.stock.in.detail.field.planNum_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.detail.field.realNum'),
    field: 'realNum',
    type: 'input-number',
    rules: [{ required: false, message: t('wms.whse.stock.in.detail.field.realNum_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.detail.field.memo'),
    field: 'memo',
    type: 'input',
    rules: [{ required: false, message: t('wms.whse.stock.in.detail.field.memo_placeholder') }],
  },
])

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = (stockInId: string) => {
  reset()
  form.stockInId = stockInId
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const res = await getWhseStockInDetail(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateWhseStockInDetail(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addWhseStockInDetail(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

defineExpose({ onAdd, onUpdate })
</script>
