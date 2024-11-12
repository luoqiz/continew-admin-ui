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
import { addWhseStockInDetail, getWhseStockInDetail, updateWhseStockInDetail } from '@/apis/wms/whseStockInDetail'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改仓库入库明细' : '新增仓库入库明细'))
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
    label: '入库id编号',
    field: 'stockInId',
    type: 'input',
    rules: [{ required: true, message: '请输入入库id编号' }],
  },
  {
    label: '商品sku',
    field: 'goodsSku',
    type: 'input',
    rules: [{ required: true, message: '请输入商品sku' }],
  },
  {
    label: '商品名称',
    field: 'goodsName',
    type: 'input',
    rules: [{ required: true, message: '请输入商品名称' }],
  },
  {
    label: '生产日期',
    field: 'prodTime',
    type: 'input',
    rules: [{ required: true, message: '请输入生产日期' }],
  },
  {
    label: '过期日期',
    field: 'expiryTime',
    type: 'input',
    rules: [{ required: true, message: '请输入过期日期' }],
  },
  {
    label: '计划入库数量',
    field: 'planNum',
    type: 'input',
    rules: [{ required: true, message: '请输入计划入库数量' }],
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
      Message.success('修改成功')
    } else {
      await addWhseStockInDetail(form)
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

defineExpose({ onAdd, onUpdate })
</script>
