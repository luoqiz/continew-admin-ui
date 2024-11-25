<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('sys.role.page.add.title')"
    :mask-closable="false"
    :esc-to-close="true"
    draggable
    :width="width >= 600 ? 600 : '100%'"
    @close="reset"
  >
    <a-steps :current="current" class="mb-15" @change="onChangeCurrent">
      <a-step>{{ $t('sys.role.add.step1') }}</a-step>
      <a-step>{{ $t('sys.role.add.step2') }}</a-step>
      <a-step>{{ $t('sys.role.add.step3') }}</a-step>
    </a-steps>
    <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>
      <fieldset v-show="current === 1">
        <a-form-item :label="$t('sys.role.field.name')" field="name">
          <a-input v-model.trim="form.name" :placeholder="$t('sys.role.field.name_placeholder')" />
        </a-form-item>
        <a-form-item :label="$t('sys.role.field.code')" field="code">
          <a-input v-model.trim="form.code" :placeholder="$t('sys.role.field.code_placeholder')" />
        </a-form-item>
        <a-form-item :label="$t('sys.role.field.sort')" field="sort">
          <a-input-number v-model="form.sort" :placeholder="$t('sys.role.field.sort_placeholder')" :min="1" mode="button" />
        </a-form-item>
        <a-form-item :label="$t('sys.role.field.description')" field="description">
          <a-textarea
            v-model.trim="form.description"
            :placeholder="$t('sys.role.field.description_placeholder')"
            show-word-limit
            :max-length="200"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </fieldset>
      <fieldset v-show="current === 2">
        <a-form-item hide-label :disabled="form.isSystem" class="w-full">
          <a-space>
            <a-checkbox v-model="isMenuExpanded" @change="onExpanded('menu')">{{ $t('page.common.tips.collapsed') }}</a-checkbox>
            <a-checkbox v-model="isMenuCheckAll" @change="onCheckAll('menu')">{{ $t('page.common.tips.selectAll') }}</a-checkbox>
            <a-checkbox v-model="form.menuCheckStrictly">{{ $t('page.common.tips.parentSub') }}</a-checkbox>
          </a-space>
          <template #extra>
            <a-tree
              ref="menuTreeRef"
              v-model:checked-keys="form.menuIds"
              class="w-full"
              :data="menuList"
              :default-expand-all="isMenuExpanded"
              :check-strictly="!form.menuCheckStrictly"
              :virtual-list-props="{ height: 400 }"
              checkable
            />
          </template>
        </a-form-item>
      </fieldset>
      <fieldset v-show="current === 3">
        <a-form-item hide-label field="dataScope">
          <a-select
            v-model.trim="form.dataScope"
            :options="data_scope_enum"
            :placeholder="$t('sys.role.field.dataScope_placeholder')"
            :disabled="form.isSystem"
          />
        </a-form-item>
        <a-form-item v-if="form.dataScope === 5" hide-label :disabled="form.isSystem">
          <a-space>
            <a-checkbox v-model="isDeptExpanded" @change="onExpanded('dept')">{{ $t('page.common.tips.collapsed') }}</a-checkbox>
            <a-checkbox v-model="isDeptCheckAll" @change="onCheckAll('dept')">{{ $t('page.common.tips.selectAll') }}</a-checkbox>
            <a-checkbox v-model="form.deptCheckStrictly">{{ $t('page.common.tips.parentSub') }}</a-checkbox>
          </a-space>
          <template #extra>
            <a-tree
              ref="deptTreeRef"
              v-model:checked-keys="form.deptIds"
              class="w-full"
              :data="deptList"
              :default-expand-all="isDeptExpanded"
              :check-strictly="!form.deptCheckStrictly"
              :virtual-list-props="{ height: 350 }"
              checkable
            />
          </template>
        </a-form-item>
      </fieldset>
    </a-form>
    <template #footer>
      <a-space size="large">
        <a-button :disabled="current === 1" type="secondary" @click="onPrev">
          <IconLeft />
          {{ $t('page.common.tips.step.previous') }}
        </a-button>
        <a-button v-if="current !== 3" :disabled="current === 3" type="primary" @click="onNext">
          {{ $t('page.common.tips.step.next') }}
          <IconRight />
        </a-button>
        <a-button v-if="current === 3" type="primary" @click="onClickOk">{{ $t('page.common.button.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { type FormInstance, Message, type TreeNodeData } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { addRole } from '@/apis/system/role'
import { useForm } from '@/hooks'
import { useDept, useDict, useMenu } from '@/hooks/app'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { width } = useWindowSize()
const { t } = useI18n()
const dataId = ref('')
const visible = ref(false)
const formRef = ref<FormInstance>()
const { data_scope_enum } = useDict('data_scope_enum')
const { deptList, getDeptList } = useDept()
const { menuList, getMenuList } = useMenu()

const rules: FormInstance['rules'] = {
  name: [{ required: true, message: t('sys.role.field.name_placeholder') }],
  code: [{ required: true, message: t('sys.role.field.code_placeholder') }],
  dataScope: [{ required: true, message: t('sys.role.field.dataScope_placeholder') }],
}

const { form, resetForm } = useForm({
  menuCheckStrictly: true,
  deptCheckStrictly: true,
  sort: 999,
  dataScope: 4,
})

const menuTreeRef = ref()
const deptTreeRef = ref()
const isMenuExpanded = ref(false)
const isDeptExpanded = ref(true)
const isMenuCheckAll = ref(false)
const isDeptCheckAll = ref(false)
const current = ref<number>(1)
// 重置
const reset = () => {
  isMenuExpanded.value = false
  isMenuCheckAll.value = false
  isDeptExpanded.value = true
  isDeptCheckAll.value = false
  menuTreeRef.value?.expandAll(isMenuExpanded.value)
  deptTreeRef.value?.expandAll(isDeptExpanded.value)
  current.value = 1
  formRef.value?.resetFields()
  resetForm()
}

// 上一步
const onPrev = () => {
  current.value = Math.max(1, current.value - 1)
}
// 下一步
const onNext = async () => {
  try {
    if (current.value === 1) {
      const isInvalid = await formRef.value?.validateField(['name', 'code', 'sort', 'description'])
      if (isInvalid) return
    }
    current.value = Math.min(3, current.value + 1)
  } catch (error) {
    console.error(error)
  }
}
// 当前页
const onChangeCurrent = (page: number) => {
  current.value = page
}

// 获取所有选中的菜单
const getMenuAllCheckedKeys = () => {
  // 获取目前被选中的菜单
  const checkedNodes = menuTreeRef.value?.getCheckedNodes()
  const checkedKeys = checkedNodes.map((item: TreeNodeData) => item.key)
  // 获取半选中的菜单
  const halfCheckedNodes = menuTreeRef.value?.getHalfCheckedNodes()
  const halfCheckedKeys = halfCheckedNodes.map((item: TreeNodeData) => item.key)
  checkedKeys.unshift(...halfCheckedKeys)
  return checkedKeys
}

// 获取所有选中的部门
const getDeptAllCheckedKeys = () => {
  if (!deptTreeRef.value) {
    return []
  }
  // 获取目前被选中的部门
  const checkedNodes = deptTreeRef.value?.getCheckedNodes()
  const checkedKeys = checkedNodes.map((item: TreeNodeData) => item.key)
  // 获取半选中的部门
  const halfCheckedNodes = deptTreeRef.value?.getHalfCheckedNodes()
  const halfCheckedKeys = halfCheckedNodes.map((item: TreeNodeData) => item.key)
  checkedKeys.unshift(...halfCheckedKeys)
  return checkedKeys
}

// 操作树
const handleTreeAction = (type, action) => {
  const refMap = {
    menu: menuTreeRef,
    dept: deptTreeRef,
  }
  const ref = refMap[type]
  if (ref && action === 'expand') {
    ref.value?.expandAll(type === 'menu' ? isMenuExpanded.value : isDeptExpanded.value)
  } else if (ref && action === 'check') {
    ref.value?.checkAll(type === 'menu' ? isMenuCheckAll.value : isDeptCheckAll.value)
  }
}

// 调用时
const onExpanded = (type) => handleTreeAction(type, 'expand')
const onCheckAll = (type) => handleTreeAction(type, 'check')

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return false
    form.menuIds = getMenuAllCheckedKeys()
    form.deptIds = getDeptAllCheckedKeys()
    await addRole(form)
    Message.success(t('page.common.message.add.success'))
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// 确认
const onClickOk = () => {
  if (unref(current) === 3) {
    save()
    visible.value = false
  }
}

// 打开
const onOpen = async () => {
  reset()
  if (!menuList.value.length) {
    await getMenuList()
  }
  if (!deptList.value.length) {
    await getDeptList()
  }
  dataId.value = ''
  visible.value = true
}

defineExpose({ onOpen })
</script>

<style scoped lang="scss">
fieldset {
  padding: 15px 15px 0 15px;
  margin-bottom: 10px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 3px;
  height: 440px;
}

fieldset legend {
  color: rgb(var(--gray-10));
  padding: 2px 5px 2px 5px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 3px;
}

.mb-15 {
  margin-bottom: 15px
}

:deep(.arco-form-item-extra) {
  width: 100%;
}
:deep(.arco-modal-footer){
  margin-top: -20px;
}
</style>
