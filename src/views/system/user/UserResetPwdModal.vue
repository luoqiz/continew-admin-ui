<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('page.common.button.resetPwd')"
    :mask-closable="false"
    :esc-to-close="false"
    :modal-style="{ maxWidth: '520px' }"
    width="90%"
    draggable
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { resetUserPwd } from '@/apis/system'
import { type Columns, GiForm } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { encryptByRsa } from '@/utils/encrypt'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()

const dataId = ref('')
const visible = ref(false)
const formRef = ref<InstanceType<typeof GiForm>>()

const options: Options = {
  form: { size: 'large' },
  btns: { hide: true },
}

const { form, resetForm } = useForm({})

const columns: Columns = computed(() => [
  { label: t('sys.user.field.password'), field: 'newPassword', type: 'input-password', rules: [{ required: true, message: t('sys.user.field.password_placeholder') }] },
])

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
    await resetUserPwd({ newPassword: encryptByRsa(form.newPassword) || '' }, dataId.value)
    Message.success(t('sys.user.tips.pwdResetSuccess'))
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// 打开
const onOpen = (id: string) => {
  reset()
  dataId.value = id
  visible.value = true
}

defineExpose({ onOpen })
</script>

<style scoped lang="scss"></style>
