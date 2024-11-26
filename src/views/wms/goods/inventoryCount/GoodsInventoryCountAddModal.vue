<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { addGoodsInventoryCount, getGoodsInventoryCount, updateGoodsInventoryCount } from '@/apis/wms/goodsInventoryCount'
import { type Columns, GiForm, type Options } from '@/components/GiForm'
import { useForm, useWhseAddr } from '@/hooks'
import { useDict } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { t } = useI18n()

const { width } = useWindowSize()

const status_enum = computed(() => [{
  value: 1,
  label: t('wms.goods.inventory.count.status.s1'),
  other: 'extra',
}, {
  value: 2,
  label: t('wms.goods.inventory.count.status.s2'),
  other: 'extra',
}, {
  value: 3,
  label: t('wms.goods.inventory.count.status.s3'),
  other: 'extra',
}])

const dataId = ref('')
const visible = ref(false)
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('wms.goods.inventory.count.page.modify.title') : t('wms.goods.inventory.count.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()
const { whseAddrOptions } = useWhseAddr()

const options: Options = {
  form: { size: 'large' },
  btns: { hide: true },
}

const { form, resetForm } = useForm({
  // todo 待补充
})

const columns: ComputedRef<Columns> = computed<Columns<typeof form>>(() => [
  {
    label: t('wms.goods.inventory.count.field.name'),
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: t('wms.goods.inventory.count.field.name_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.field.whseId'),
    field: 'whseId',
    type: 'CustomWhseSelect',
    props: {
      options: whseAddrOptions.value,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.field.whseId_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.field.status'),
    field: 'status',
    type: 'select',
    props: {
      options: status_enum.value,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.field.status_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.field.startTime'),
    field: 'startTime',
    type: 'date-picker',
    props: {
      showTime: true,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.field.startTime_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.field.endTime'),
    field: 'endTime',
    type: 'date-picker',
    props: {
      showTime: true,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.field.endTime_placeholder') }],
  },
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
    if (isUpdate.value) {
      await updateGoodsInventoryCount(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addGoodsInventoryCount(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (error) {
    console.error(error)
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
  const { data } = await getGoodsInventoryCount(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    draggable
    :width="width >= 600 ? 600 : '100%'"
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<style scoped lang="scss"></style>
