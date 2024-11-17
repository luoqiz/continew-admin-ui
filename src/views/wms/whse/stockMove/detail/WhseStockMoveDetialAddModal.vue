<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 600 ? 600 : '100%'"
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { addWhseStockMoveDetail, getWhseStockMoveDetail, updateWhseStockMoveDetial } from '@/apis/wms/whseStockMoveDetail'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()
const { width } = useWindowSize()

const dataId = ref('')
const visible = ref(false)
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.whse.stock.move.detial.page.modify.title') : t('wms.whse.stock.move.detial.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()

const options: Options = {
  form: { size: 'large' },
  btns: { hide: true },
}

const columns: Columns = computed<Columns<typeof form>>(() => [
  {
    label: t('wms.whse.stock.move.detial.field.stockMoveNo'),
    field: 'stockMoveNo',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.stockMoveNo_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.detial.field.goodsStockId'),
    field: 'goodsStockId',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.goodsStockId_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.detial.field.goodsSku'),
    field: 'goodsSku',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.goodsSku_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.detial.field.goodsName'),
    field: 'goodsName',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.goodsName_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.detial.field.moveTime'),
    field: 'moveTime',
    type: 'date-picker',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.moveTime_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.detial.field.prodTime'),
    field: 'prodTime',
    type: 'date-picker',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.prodTime_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.detial.field.expiryTime'),
    field: 'expiryTime',
    type: 'date-picker',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.expiryTime_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.detial.field.planNum'),
    field: 'planNum',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.move.detial.field.planNum_placeholder') }],
  },
])

const { form, resetForm } = useForm({
  // todo 待补充
})

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateWhseStockMoveDetial(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addWhseStockMoveDetail(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// 新增
const onAdd = async () => {
  reset()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const { data } = await getWhseStockMoveDetail(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>
