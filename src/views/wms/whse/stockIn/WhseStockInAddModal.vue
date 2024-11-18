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
import { addWhseStockIn, getWhseStockIn, updateWhseStockIn } from '@/apis/wms/whseStockIn'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.whse.stock.in.page.modify.title') : t('wms.whse.stock.in.page.add.title')))
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
    label: t('wms.whse.stock.in.field.name'),
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.in.field.name_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.field.stockInNo'),
    field: 'stockInNo',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.in.field.stockInNo_placeholder') }],
  },
  {
    label: t('wms.whse.stock.in.field.whseName'),
    field: 'whseId',
    type: 'CustomWhseSelect',
    rules: [{ required: true, message: t('wms.whse.stock.in.field.whseId_placeholder') }],
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
  const res = await getWhseStockIn(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateWhseStockIn(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addWhseStockIn(form)
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
