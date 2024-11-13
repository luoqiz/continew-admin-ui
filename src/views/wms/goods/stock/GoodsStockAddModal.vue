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
import { addGoodsStock, getGoodsStock, updateGoodsStock } from '@/apis/wms/goodsStock'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.goods.stock.page.modify.title') : t('wms.goods.stock.page.add.title')))
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
    label: t('wms.goods.stock.field.stockInId'),
    field: 'stockInId',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.stockInId_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.stockInNo'),
    field: 'stockInNo',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.stockInNo_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.stockInDetailId'),
    field: 'stockInDetailId',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.stockInDetailId_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.goodsId'),
    field: 'goodsId',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.goodsId_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.goodsSku'),
    field: 'goodsSku',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.goodsSku_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.initNum'),
    field: 'initNum',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.initNum_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.realNum'),
    field: 'realNum',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.realNum_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.whseType'),
    field: 'whseType',
    type: 'radio-group',
    rules: [{ required: true, message: t('wms.goods.stock.field.whseType_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.whseId'),
    field: 'whseId',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.stock.field.whseId_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.prodTime'),
    field: 'prodTime',
    type: 'time-picker',
    rules: [{ required: true, message: t('wms.goods.stock.field.prodTime_placeholder') }],
  },
  {
    label: t('wms.goods.stock.field.expiryTime'),
    field: 'expiryTime',
    type: 'time-picker',
    rules: [{ required: true, message: t('wms.goods.stock.field.expiryTime_placeholder') }],
  },
])

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = () => {
  reset()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const res = await getGoodsStock(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateGoodsStock(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addGoodsStock(form)
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
