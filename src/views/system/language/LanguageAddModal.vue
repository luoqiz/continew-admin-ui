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
import { addLanguage, getLanguage, updateLanguage } from '@/apis/system/language'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm } from '@/hooks'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()
const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('sys.language.page.modify.title') : t('sys.language.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()

const options: Options = {
  form: {},
  col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  btns: { hide: true },
}

const columns: Columns = computed(() => [
  {
    label: t('sys.language.field.moduleId'),
    field: 'moduleId',
    type: 'input',
    rules: [{ required: true, message: t('sys.language.field.moduleId_placeholder') }],
  },
  {
    label: t('sys.language.field.moduleName'),
    field: 'moduleName',
    type: 'input',
    rules: [{ required: true, message: t('sys.language.field.moduleName_placeholder') }],
  },
])

const { form, resetForm } = useForm({
  // todo 待补充
})

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
  const res = await getLanguage(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateLanguage(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addLanguage(form)
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
