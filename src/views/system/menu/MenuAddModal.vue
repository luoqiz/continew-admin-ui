<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 600 ? 600 : '100%'"
    draggable
    @before-ok="save"
    @close="reset"
  >
    <a-form ref="formRef" :model="form" :rules="formRules" auto-label-width>
      <a-form-item :label="$t('sys.menu.field.type')" field="type">
        <a-radio-group v-model="form.type" type="button" :disabled="isUpdate" @change="onChangeType">
          <a-radio :value="1">{{ $t('sys.menu.type.t1') }}</a-radio>
          <a-radio :value="2">{{ $t('sys.menu.type.t2') }}</a-radio>
          <a-radio :value="3">{{ $t('sys.menu.type.t3') }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('sys.menu.field.parentId')" field="parentId">
        <a-tree-select
          v-model="form.parentId"
          :placeholder="$t('sys.menu.field.parentId_placeholder')"
          allow-clear
          allow-search
          :data="(menuSelectTree as any)"
          :fallback-option="false"
          :filter-tree-node="filterOptions"
        />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type)" :label="$t('sys.menu.field.icon')" field="icon">
        <GiIconSelector v-model="form.icon" />
      </a-form-item>
      <a-form-item :label="$t('sys.menu.field.title')" field="title">
        <a-input v-model.trim="form.title" :placeholder="$t('sys.menu.field.title_placeholder')" allow-clear />
      </a-form-item>
      <a-form-item :label="$t('sys.menu.field.locale')" field="locale">
        <a-input v-model.trim="form.locale" :placeholder="$t('sys.menu.field.locale_placeholder')" allow-clear />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type)" :label="$t('sys.menu.field.path')" field="path">
        <a-input v-model.trim="form.path" :placeholder="$t('sys.menu.field.path_placeholder')" allow-clear />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type) && !form.isExternal" :label="$t('sys.menu.field.redirect')" field="redirect">
        <a-input v-model.trim="form.redirect" :placeholder="$t('sys.menu.field.redirect_placeholder')" allow-clear />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type) && !form.isExternal" :label="$t('sys.menu.field.name')" field="name">
        <a-input v-model.trim="form.name" :placeholder="$t('sys.menu.field.name_placeholder')" allow-clear />
        <!-- <template #extra>
          <div v-if="componentName">
            <span>建议组件名称：</span>
            <a-tag checkable @check="inputComponentName">{{ componentName }}</a-tag>
          </div>
        </template> -->
      </a-form-item>
      <a-form-item v-if="form.type === 2" :label="$t('sys.menu.field.component')" field="component">
        <a-input v-if="form.isExternal" v-model.trim="form.component" :placeholder="$t('sys.menu.field.component_placeholder')" allow-clear />
        <a-input v-else v-model.trim="form.component" :placeholder="$t('sys.menu.field.component_placeholder')" allow-clear>
          <template #prepend>@/views/</template>
          <template #append>.vue</template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="form.type === 3" :label="$t('sys.menu.field.permission')" field="permission">
        <a-input v-model.trim="form.permission" placeholder="system:user:add" allow-clear />
      </a-form-item>
      <a-row v-if="[1, 2].includes(form.type)" :gutter="16">
        <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="8">
          <a-form-item :label="$t('sys.menu.field.isHidden')" field="hidden">
            <a-switch
              v-model="form.isHidden"
              :checked-value="true"
              :unchecked-value="false"
              :checked-text="$t('page.common.field.true')"
              :unchecked-text="$t('page.common.field.false')"
              type="round"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="8">
          <a-form-item :label="$t('sys.menu.field.isHidden')" field="keepAlive">
            <a-switch
              v-model="form.isCache"
              :checked-value="true"
              :unchecked-value="false"
              :checked-text="$t('page.common.field.true')"
              :unchecked-text="$t('page.common.field.false')"
              type="round"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="8">
          <a-form-item v-if="form.type === 2" :label="$t('sys.menu.field.isExternal')" field="isExternalUrl">
            <a-switch
              v-model="form.isExternal"
              :checked-value="true"
              :unchecked-value="false"
              :checked-text="$t('page.common.field.true')"
              :unchecked-text="$t('page.common.field.false')"
              type="round"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :label="$t('sys.menu.field.sort')" field="sort">
        <a-input-number v-model="form.sort" :placeholder="$t('sys.menu.field.sort_placeholder')" :min="1" mode="button" style="width: 150px" />
      </a-form-item>
      <a-form-item :label="$t('sys.menu.field.status')" field="status">
        <a-switch
          v-model="form.status"
          type="round"
          :checked-value="1"
          :unchecked-value="2"
          :checked-text="$t('sys.menu.status.s1')"
          :unchecked-text="$t('sys.menu.status.s2')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { type FormInstance, Message, type TreeNodeData } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { mapTree } from 'xe-utils'
import { useI18n } from 'vue-i18n'
import { type MenuResp, addMenu, getMenu, updateMenu } from '@/apis/system/menu'
import { useForm } from '@/hooks'
import { filterTree, transformPathToName } from '@/utils'

interface Props {
  menus: MenuResp[]
}
const props = withDefaults(defineProps<Props>(), {
  menus: () => [],
})

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const { width } = useWindowSize()
const { t } = useI18n()
const dataId = ref('')
const visible = ref(false)
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? t('sys.menu.page.modify.title') : t('sys.menu.page.add.title')))
const formRef = ref<FormInstance>()

const { form, resetForm } = useForm({
  type: 1,
  sort: 999,
  isExternal: false,
  isCache: false,
  isHidden: false,
  status: 1,
})

// const componentName = computed(() => transformPathToName(form.path))
const rules: FormInstance['rules'] = {
  parentId: [{ required: true, message: t('sys.menu.field.parentId_placeholder') }],
  title: [{ required: true, message: t('sys.menu.field.title_placeholder') }],
  path: [{ required: true, message: t('sys.menu.field.path_placeholder') }],
  name: [{ required: true, message: t('sys.menu.field.name_placeholder') }],
  component: [{ required: true, message: t('sys.menu.field.component_placeholder') }],
  permission: [{ required: true, message: t('sys.menu.field.permission_placeholder') }],
}

// const rules: ComputedRef<FormInstance['rules']> = computed(() => {
//   return {
//     parentId: [{ required: true, message: t('sys.menu.field.parentId_placeholder') }],
//     title: [{ required: true, message: t('sys.menu.field.title_placeholder') }],
//     path: [{ required: true, message: t('sys.menu.field.path_placeholder') }],
//     name: [{ required: true, message: t('sys.menu.field.name_placeholder') }],
//     component: [{ required: true, message: t('sys.menu.field.component_placeholder') }],
//     permission: [{ required: true, message: t('sys.menu.field.permission_placeholder') }],
//   }
// })
// eslint-disable-next-line vue/return-in-computed-property
const formRules = computed(() => {
  if ([1, 2].includes(form.type)) {
    const { title, name, path } = rules
    return { title, name, path } as FormInstance['rules']
  }
  if (form.type === 3) {
    const { parentId, title, permission } = rules
    return { parentId, title, permission } as FormInstance['rules']
  }
})

// 重置
const reset = () => {
  formRef.value?.resetFields()
  resetForm()
}

// 设置建议组件名
// const inputComponentName = () => {
//   form.name = componentName.value
// }

// 切换类型清除校验
const onChangeType = () => {
  formRef.value?.clearValidate()
}

// 转换为菜单树
const menuSelectTree = computed(() => {
  const menus = JSON.parse(JSON.stringify(props.menus)) as MenuResp[]
  const data = filterTree(menus, (i) => [1, 2].includes(i.type))
  return mapTree(data, (i) => ({
    key: i.id,
    title: i.title,
    children: i.children,
  }))
})

// 过滤树
const filterOptions = (searchKey: string, nodeData: TreeNodeData) => {
  if (nodeData.title) {
    return nodeData.title.toLowerCase().includes(searchKey.toLowerCase())
  }
  return false
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateMenu(form, dataId.value)
      Message.success(t('page.common.message.modify.success'))
    } else {
      await addMenu(form)
      Message.success(t('page.common.message.add.success'))
    }
    emit('save-success')
    return true
  } catch (error) {
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
  const { data } = await getMenu(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>

<style scoped lang="scss"></style>
