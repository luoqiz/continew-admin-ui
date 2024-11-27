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
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { addGoodsSku, getGoodsSku, updateGoodsSku } from '@/apis/wms/goodsSku'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()
const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.goods.sku.page.modify.title') : t('wms.goods.sku.page.add.title')))
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
    label: t('wms.goods.sku.field.barcode'),
    field: 'barcode',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.sku.field.barcode_placeholder') }],
  },
  {
    label: t('wms.goods.sku.field.name'),
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.sku.field.name_placeholder') }],
  },
  {
    label: t('wms.goods.sku.field.price'),
    field: 'price',
    type: 'input-number',
    rules: [{ required: true, message: t('wms.goods.sku.field.price_placeholder') }],
  },
  {
    label: t('wms.goods.sku.field.unit'),
    field: 'unit',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.sku.field.unit_placeholder') }],
  },
  {
    label: t('wms.goods.sku.field.amount'),
    field: 'amount',
    type: 'input-number',
    rules: [{ required: true, message: t('wms.goods.sku.field.amount_placeholder') }],
  },
  {
    label: t('wms.goods.sku.field.unpacking'),
    field: 'unpacking',
    type: 'radio-group',
    options: [
      { label: t('page.common.field.true'), value: 'true' },
      { label: t('page.common.field.false'), value: 'false' },
    ],
    rules: [{ required: true, message: t('wms.goods.sku.field.unpacking_placeholder') }],
  },
  {
    label: t('wms.goods.sku.field.packUnit'),
    field: 'packUnit',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.sku.field.packUnit_placeholder') }],
  },
  {
    label: t('wms.goods.sku.field.packAmount'),
    field: 'packAmount',
    type: 'input-number',
    rules: [{ required: true, message: t('wms.goods.sku.field.packAmount_placeholder') }],
  },
  // {
  //   label: t('wms.goods.sku.field.status'),
  //   field: 'status',
  //   type: 'radio-group',
  //   rules: [{ required: true, message: t('wms.goods.sku.field.status_placeholder') }]
  // },
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
  const res = await getGoodsSku(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateGoodsSku(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addGoodsSku(form)
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
