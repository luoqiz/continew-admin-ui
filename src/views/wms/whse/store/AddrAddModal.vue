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
import { addStore, getAddr, updateAddr } from '@/apis/wms/addr'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDept } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { deptList, getDeptList } = useDept()

const { t } = useI18n()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.whse.addr.page.modify.title') : t('wms.whse.addr.page.add.title')))
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
    label: t('wms.whse.addr.field.whseNo'),
    field: 'whseNo',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.addr.field.whseNo_placeholder') }],
  },
  {
    label: t('wms.whse.addr.field.name'),
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: t('wms.whse.addr.field.name_placeholder') }],
  },
  {
    label: t('wms.whse.addr.field.addr'),
    field: 'addr',
    type: 'input',
    rules: [{ required: false, message: t('wms.whse.addr.field.addr_placeholder') }],
  },
  {
    label: t('wms.whse.addr.field.status'),
    field: 'status',
    type: 'switch',
    props: {
      checkedValue: 1,
      uncheckedValue: 2,
    },
    rules: [{ required: true, message: t('wms.whse.addr.field.status_placeholder') }],
  },
  {
    label: t('wms.whse.addr.field.memo'),
    field: 'memo',
    type: 'input',
    rules: [{ required: false, message: t('wms.whse.addr.field.memo_placeholder') }],
  },
  {
    label: t('wms.whse.addr.field.deptId'),
    field: 'deptId',
    type: 'tree-select',
    data: deptList,
    props: {
      placeholder: t('wms.whse.addr.field.deptId_placeholder'),
      allowClear: true,
      allowSearch: true,
      fallbackOption: false,
      filterTreeNode(searchKey: string, nodeData: TreeNodeData) {
        if (nodeData.title) {
          return nodeData.title.toLowerCase().includes(searchKey.toLowerCase())
        }
        return false
      },
    },
    rules: [{ required: true, message: t('wms.whse.addr.field.deptId_placeholder') }],
  },
])

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = async () => {
  reset()
  if (!deptList.value.length) {
    await getDeptList()
  }
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  if (!deptList.value.length) {
    await getDeptList()
  }
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
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addStore(form)
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
