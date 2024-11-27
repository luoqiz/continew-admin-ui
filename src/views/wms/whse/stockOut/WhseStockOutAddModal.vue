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
import { addWhseStockOut, getWhseStockOut, updateWhseStockOut } from '@/apis/wms/whseStockOut'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm, useWhseAddr } from '@/hooks'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()
const { whseAddrOptions } = useWhseAddr()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.whse.stock.out.page.modify.title') : t('wms.whse.stock.out.page.add.title')))
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
    label: t('wms.whse.stock.out.field.name'),
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.out.field.name_placeholder') }],
  },
  {
    label: t('wms.whse.stock.out.field.stockOutNo'),
    field: 'stockOutNo',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.out.field.stockOutNo_placeholder') }],
  },
  {
    label: t('wms.whse.stock.out.field.whseName'),
    field: 'whseId',
    type: 'CustomWhseSelect',
    props: {
      options: whseAddrOptions.value,
    },
    rules: [{ required: true, message: t('wms.whse.stock.out.field.whseName_placeholder') }],
  },
  // {
  //   label: t('wms.whse.stock.out.field.status'),
  //   field: 'status',
  //   type: 'select',
  //   rules: [{ required: true, message: t('wms.whse.stock.out.field.status_placeholder') }]
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
  const res = await getWhseStockOut(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateWhseStockOut(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addWhseStockOut(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

defineExpose({ onAdd, onUpdate })
</script>
