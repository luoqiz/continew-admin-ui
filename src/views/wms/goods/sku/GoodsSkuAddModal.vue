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
import { addGoodsSku, getGoodsSku, updateGoodsSku } from '@/apis/wms/goodsSku'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改商品规格(sku)' : '新增商品规格(sku)'))
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
    label: '条形码',
    field: 'barcode',
    type: 'input',
    rules: [{ required: true, message: '请输入条形码' }],
  },
  {
    label: '规格名称',
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入规格名称' }],
  },
  {
    label: '单价',
    field: 'price',
    type: 'input-number',
    rules: [{ required: true, message: '请输入价格' }],
  },
  {
    label: '单位',
    field: 'unit',
    type: 'input',
    rules: [{ required: true, message: '请输入单位' }],
  },
  {
    label: '数量',
    field: 'amount',
    type: 'input-number',
    rules: [{ required: true, message: '请输入数量' }],
  },
  {
    label: '拆箱',
    field: 'unpacking',
    type: 'radio-group',
    options: [
      { label: '是', value: 'true' },
      { label: '否', value: 'false' },
    ],
    rules: [{ required: true, message: '请输入拆箱' }],
  },
  {
    label: '拆箱单位',
    field: 'packUnit',
    type: 'input',
    rules: [{ message: '请输入拆箱单位' }],
  },
  {
    label: '拆箱数量',
    field: 'packAmount',
    type: 'input-number',
    rules: [{ message: '请输入拆箱数量' }],
  },
  // {
  //   label: '状态 1上架  2下架',
  //   field: 'status',
  //   type: 'radio-group',
  //   rules: [{ required: true, message: '请输入状态 1上架  2下架' }],
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
      Message.success('修改成功')
    } else {
      await addGoodsSku(form)
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
