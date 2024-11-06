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
import { addStore, getAddr, updateAddr } from '@/apis/wms/addr'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改仓库地址' : '新增仓库地址'))
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
    label: '仓库编号',
    field: 'whseNo',
    type: 'input',
    rules: [{ required: true, message: '请输入仓库编号' }],
  },
  {
    label: '仓库名称',
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入仓库名称' }],
  },
  {
    label: '仓库地址',
    field: 'addr',
    type: 'input',
  },
  // {
  //   label: '仓库类型 (1国仓  2地仓  3店仓)',
  //   field: 'whseType',
  //   type: 'input',
  // },
  {
    label: '状态 (1使用  2停用)',
    field: 'status',
    type: 'switch',
    props: {
      checkedValue: 1,
      uncheckedValue: 0,
    },
    rules: [{ required: true, message: '请输入状态 (1使用  2停用)' }],
  },
  {
    label: '备注信息',
    field: 'memo',
    type: 'input',
  },
  {
    label: '所属部门',
    field: 'deptId',
    type: 'tree-select',
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
  const res = await getAddr(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateAddr(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addStore(form)
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
