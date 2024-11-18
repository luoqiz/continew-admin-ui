<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 600 ? 600 : '90%'"
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns">
    </GiForm>
  </a-modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { addWhseStockMove, getWhseStockMove, updateWhseStockMove } from '@/apis/wms/whseStockMove'
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
const title = computed(() => (isUpdate.value ? t('wms.whse.stock.move.page.modify.title') : t('wms.whse.stock.move.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()

const options: Options = {
  form: { size: 'large' },
  btns: { hide: true },
}

const columns = computed<Columns<typeof form>>(() => [
  {
    label: t('wms.whse.stock.move.field.name'),
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.move.field.name_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.field.stockMoveNo'),
    field: 'stockMoveNo',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.stock.move.field.stockMoveNo_placeholder') }],
  },
  // {
  //   label: t('wms.whse.stock.move.field.stockMoveType'),
  //   field: 'stockMoveType',
  //   type: 'input',
  //   rules: [{ required: true, message: t('wms.whse.stock.move.field.stockMoveType_placeholder') }],
  // },
  {
    label: t('wms.whse.stock.move.field.stockOutWhseName'),
    field: 'stockOutWhseId',
    type: 'CustomWhseSelect',
    rules: [{ required: true, message: t('wms.whse.stock.move.field.stockOutWhseName_placeholder') }],
  },
  {
    label: t('wms.whse.stock.move.field.stockInWhseName'),
    field: 'stockInWhseId',
    type: 'CustomWhseSelect',
    rules: [{ required: true, message: t('wms.whse.stock.move.field.stockInWhseName_placeholder') }],
  },
  // {
  //   label: t('wms.whse.stock.move.field.status'),
  //   field: 'status',
  //   type: 'input',
  //   rules: [{ required: true, message: t('wms.whse.stock.move.field.status_placeholder') }],
  // },
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
      await updateWhseStockMove(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addWhseStockMove(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (_error) {
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
  const { data } = await getWhseStockMove(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>
