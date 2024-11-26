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

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { addGoodsInventoryCountItem, getGoodsInventoryCountItem, updateGoodsInventoryCountItem } from '@/apis/wms/goodsInventoryCountItem'
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
const title = computed(() => (isUpdate.value ? t('wms.goods.inventory.count.item.page.modify.title') : t('wms.goods.inventory.count.item.page.add.title')))
const formRef = ref<InstanceType<typeof GiForm>>()

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

const options: Options = {
  form: { size: 'large' },
  btns: { hide: true },
}

const { form, resetForm } = useForm({
  // todo 待补充
})

const columns: ComputedRef<Columns> = computed<Columns<typeof form>>(() => [
  {
    label: t('wms.goods.inventory.count.item.field.inventoryCountId'),
    field: 'inventoryCountId',
    type: 'input',
    props: {
      disabled: true,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.inventoryCountId_placeholder') }],
  },
  // {
  //   label: t('wms.goods.inventory.count.item.field.stockId'),
  //   field: 'stockId',
  //   type: 'input',
  //   rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.stockId_placeholder') }],
  // },
  // {
  //   label: t('wms.goods.inventory.count.item.field.goodsId'),
  //   field: 'goodsId',
  //   type: 'input',
  //   rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.goodsId_placeholder') }],
  // },
  {
    label: t('wms.goods.inventory.count.item.field.goodsSku'),
    field: 'goodsSku',
    type: 'input',
    props: {
      disabled: true,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.goodsSku_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.item.field.initNum'),
    field: 'initNum',
    type: 'input',
    props: {
      disabled: true,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.initNum_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.item.field.realNum'),
    field: 'realNum',
    type: 'input-number',
    rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.realNum_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.item.field.status'),
    field: 'status',
    type: 'select',
    props: {
      options: status_enum.value,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.status_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.item.field.prodTime'),
    field: 'prodTime',
    type: 'input',
    props: {
      disabled: true,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.prodTime_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.item.field.expiryTime'),
    field: 'expiryTime',
    type: 'input',
    props: {
      disabled: true,
    },
    rules: [{ required: true, message: t('wms.goods.inventory.count.item.field.expiryTime_placeholder') }],
  },
  {
    label: t('wms.goods.inventory.count.item.field.memo'),
    field: 'memo',
    type: 'input',
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
      await updateGoodsInventoryCountItem(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addGoodsInventoryCountItem(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (error) {
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
  const { data } = await getGoodsInventoryCountItem(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>

<style scoped lang="scss"></style>
