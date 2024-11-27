<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 500 ? 500 : '100%'"
    draggable
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { mapTree } from 'xe-utils'
import { useI18n } from 'vue-i18n'
import { type DeptResp, addDept, getDept, updateDept } from '@/apis/system/dept'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'

interface Props {
  depts: DeptResp[]
}
const props = withDefaults(defineProps<Props>(), {
  depts: () => [],
})

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { width } = useWindowSize()

const t = useI18n().t

const dataId = ref('')
const visible = ref(false)
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('sys.dept.page.modify.title') : t('sys.dept.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()

// 转换为部门树
const deptSelectTree = computed(() => {
  const data = JSON.parse(JSON.stringify(props.depts)) as DeptResp[]
  return mapTree(data, (i) => ({
    key: i.id,
    title: i.name,
    children: i.children,
  }))
})

const options: Options = {
  form: { size: 'large' },
  btns: { hide: true },
}

const { form, resetForm } = useForm({
  sort: 999,
  status: 1,
})

const columns = computed(() => {
  return [
    {
      label: t('sys.dept.field.parentId'),
      field: 'parentId',
      type: 'tree-select',
      data: deptSelectTree,
      hide: (form) => {
        return form.parentId === 0
      },
      props: {
        allowClear: true,
        allowSearch: true,
        fallbackOption: false,
        filterTreeNode(searchKey, nodeData) {
          if (nodeData.title) {
            return nodeData.title.toLowerCase().includes(searchKey.toLowerCase())
          }
          return false
        },
      },
      rules: [{ required: true, message: t('sys.dept.field.parentId_placeholder') }],
    },
    {
      label: t('sys.dept.field.name'),
      field: 'name',
      type: 'input',
      rules: [{ required: true, message: t('sys.dept.field.name_placeholder') }],
      props: {
        maxLength: 30,
      },
    },
    {
      label: t('sys.dept.field.sort'),
      field: 'sort',
      type: 'input-number',
      props: {
        min: 1,
        mode: 'button',
      },
    },
    {
      label: t('sys.dept.field.description'),
      field: 'description',
      type: 'textarea',
      props: {
        maxLength: 200,
        autoSize: { minRows: 3, maxRows: 5 },
      },
    },
    {
      label: t('sys.dept.field.status'),
      field: 'status',
      type: 'switch',
      props: {
        type: 'round',
        checkedValue: 1,
        uncheckedValue: 2,
        checkedText: t('page.common.tips.enable'),
        uncheckedText: t('page.common.tips.disable'),
      },
    },
  ]
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
      await updateDept(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addDept(form)
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// 新增
const onAdd = (id?: string) => {
  reset()
  form.parentId = id
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const { data } = await getDept(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>

<style scoped lang="scss"></style>
