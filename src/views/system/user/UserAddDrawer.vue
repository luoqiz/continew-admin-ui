<template>
  <a-drawer
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 600 ? 600 : '100%'"
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-drawer>
</template>

<script setup lang="ts">
import { Message, type TreeNodeData } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { addUser, getUser, updateUser } from '@/apis/system/user'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import type { Gender, Status } from '@/types/global'
import { GenderList } from '@/constant/common'
import { useForm } from '@/hooks'
import { useDept, useRole } from '@/hooks/app'
import { encryptByRsa } from '@/utils/encrypt'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { width } = useWindowSize()
const { t } = useI18n()

const dataId = ref('')
const visible = ref(false)
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('sys.user.page.modify.title') : t('sys.user.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()
const { roleList, getRoleList } = useRole()
const { deptList, getDeptList } = useDept()

const options: Options = {
  form: { size: 'large' },
  btns: { hide: true },
}

const { form, resetForm } = useForm({
  gender: 1 as Gender,
  status: 1 as Status,
})

const columns = computed(() => [
  {
    label: t('sys.user.field.username'),
    field: 'username',
    type: 'input',
    props: {
      placeholder: t('sys.user.field.username_placeholder'),
      maxLength: 64,
      showWordLimit: true,
    },
    rules: [{ required: true, message: t('sys.user.field.username_placeholder') }],
  },
  {
    label: t('sys.user.field.nickname'),
    field: 'nickname',
    type: 'input',
    props: {
      placeholder: t('sys.user.field.nickname_placeholder'),
      maxLength: 30,
      showWordLimit: true,
    },
    rules: [{ required: true, message: t('sys.user.field.nickname_placeholder') }],
  },
  {
    label: t('sys.user.field.password'),
    field: 'password',
    type: 'input-password',
    props: {
      placeholder: t('sys.user.field.password_placeholder'),
      maxLength: 32,
      showWordLimit: true,
    },
    rules: [{ required: true, message: t('sys.user.field.password_placeholder') }],
    hide: () => {
      return isUpdate.value
    },
  },
  {
    label: t('sys.user.field.phone'),
    field: 'phone',
    type: 'input',
    props: {
      placeholder: t('sys.user.field.phone_placeholder'),
      maxLength: 11,
    },
  },
  {
    label: t('sys.user.field.email'),
    field: 'email',
    type: 'input',
    props: {
      placeholder: t('sys.user.field.email_placeholder'),
      maxLength: 255,
    },
  },
  {
    label: t('sys.user.field.gender'),
    field: 'gender',
    type: 'radio-group',
    options: GenderList,
  },
  {
    label: t('sys.user.field.deptId'),
    field: 'deptId',
    type: 'tree-select',
    data: deptList,
    props: {
      placeholder: t('sys.user.field.deptId_placeholder'),
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
    rules: [{ required: true, message: t('sys.user.field.deptId_placeholder') }],
  },
  {
    label: t('sys.user.field.role'),
    field: 'roleIds',
    type: 'select',
    options: roleList,
    props: {
      placeholder: t('sys.user.field.role_placeholder'),
      multiple: true,
      allowClear: true,
      allowSearch: true,
    },
    rules: [{ required: true, message: t('sys.user.field.role_placeholder') }],
  },
  {
    label: t('sys.user.field.description'),
    field: 'description',
    type: 'textarea',
    props: {
      placeholder: t('sys.user.field.description_placeholder'),
      maxLength: 200,
      showWordLimit: true,
      autoSize: { minRows: 3, maxRows: 5 },
    },
  },
  {
    label: t('sys.user.field.status'),
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
])

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

// 保存
const save = async () => {
  const rawPassword = form.password
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateUser(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      if (rawPassword) {
        form.password = encryptByRsa(rawPassword) || ''
      }
      await addUser(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (error) {
    form.password = rawPassword
    return false
  }
}

// 新增
const onAdd = async () => {
  reset()
  if (!deptList.value.length) {
    await getDeptList()
  }
  if (!roleList.value.length) {
    await getRoleList()
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
  if (!roleList.value.length) {
    await getRoleList()
  }
  const { data } = await getUser(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>

<style scoped lang="scss"></style>
