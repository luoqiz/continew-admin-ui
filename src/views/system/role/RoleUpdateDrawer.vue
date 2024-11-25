<template>
  <a-drawer
    v-model:visible="visible"
    :title="$t('sys.role.page.modify.title')"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 600 ? 600 : '100%'"
    @before-ok="save"
    @close="reset"
  >
    <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>
      <fieldset>
        <legend>{{ $t('sys.role.add.step1') }}</legend>
        <a-form-item :label="$t('sys.role.field.name')" field="name">
          <a-input v-model.trim="form.name" :placeholder="$t('sys.role.field.name_placeholder')" />
        </a-form-item>
        <a-form-item :label="$t('sys.role.field.code')" field="code">
          <a-input v-model.trim="form.code" :placeholder="$t('sys.role.field.code_placeholder')" :disabled="isUpdate" />
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
      <fieldset>
        <legend>{{ $t('sys.role.add.step2') }}</legend>
        <a-form-item hide-label :disabled="form.isSystem">
          <a-space>
            <a-checkbox v-model="isMenuExpanded" @change="onExpanded('menu')">{{ $t('page.common.tips.collapsed') }}</a-checkbox>
            <a-checkbox v-model="isMenuCheckAll" @change="onCheckAll('menu')">{{ $t('page.common.tips.selectAll') }}</a-checkbox>
            <a-checkbox v-model="form.menuCheckStrictly">{{ $t('page.common.tips.parentSub') }}</a-checkbox>
          </a-space>
          <template #extra>
            <a-tree
              ref="menuTreeRef"
              :data="menuList"
              :default-expand-all="isMenuExpanded"
              :check-strictly="!form.menuCheckStrictly"
              checkable
            />
          </template>
        </a-form-item>
      </fieldset>
      <fieldset>
        <legend>{{ $t('sys.role.add.step3') }}</legend>
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
              :data="deptList"
              :default-expand-all="isDeptExpanded"
              :check-strictly="!form.deptCheckStrictly"
              checkable
            />
          </template>
        </a-form-item>
      </fieldset>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { type FormInstance, Message, type TreeNodeData } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { getRole, updateRole } from '@/apis/system/role'
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
// 重置
const reset = () => {
  isMenuExpanded.value = false
  isMenuCheckAll.value = false
  isDeptExpanded.value = true
  isDeptCheckAll.value = false
  menuTreeRef.value?.expandAll(isMenuExpanded.value)
  menuTreeRef.value?.checkAll(false)
  deptTreeRef.value?.expandAll(isDeptExpanded.value)
  deptTreeRef.value?.checkAll(false)
  formRef.value?.resetFields()
  resetForm()
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

// 展开/折叠
const onExpanded = (type: string) => {
  if (type === 'menu') {
    menuTreeRef.value?.expandAll(isMenuExpanded.value)
  } else if (type === 'dept') {
    deptTreeRef.value?.expandAll(isDeptExpanded.value)
  }
}

// 全选/全不选
const onCheckAll = (type: string) => {
  if (type === 'menu') {
    menuTreeRef.value?.checkAll(isMenuCheckAll.value)
  } else if (type === 'dept') {
    deptTreeRef.value?.checkAll(isDeptCheckAll.value)
  }
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return false
    form.menuIds = getMenuAllCheckedKeys()
    form.deptIds = getDeptAllCheckedKeys()
    await updateRole(form, dataId.value)
    Message.success(t('page.common.message.modify.success'))
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// 打开
const onOpen = async (id: string) => {
  reset()
  dataId.value = id
  if (!menuList.value.length) {
    await getMenuList()
  }
  if (!deptList.value.length) {
    await getDeptList()
  }
  const { data } = await getRole(id)
  Object.assign(form, data)
  data.menuIds?.forEach((node) => {
    nextTick(() => {
      menuTreeRef.value?.checkNode(node, true, true)
    })
  })
  data.deptIds?.forEach((node) => {
    nextTick(() => {
      deptTreeRef.value?.checkNode(node, true, true)
    })
  })
  visible.value = true
}

defineExpose({ onOpen })
</script>

<style scoped lang="scss">
fieldset {
  padding: 15px 15px 0 15px;
  margin-bottom: 15px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 3px;
}
fieldset legend {
  color: rgb(var(--gray-10));
  padding: 2px 5px 2px 5px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 3px;
}
</style>
