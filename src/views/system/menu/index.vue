<template>
  <div class="table-page">
    <GiTable
      ref="tableRef"
      :title="$t('sys.menu.table')"
      row-key="id"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1700 }"
      :pagination="false"
      :disabled-column-keys="['title']"
      @refresh="search"
    >
      <template #expand-icon="{ expanded }">
        <IconDown v-if="expanded" />
        <IconRight v-else />
      </template>
      <template #toolbar-left>
        <!-- <a-input v-model="title" placeholder="请输入菜单标题" allow-clear>
          <template #prefix><icon-search /></template>
        </a-input>
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>{{ $t('page.common.button.reset') }}</template>
        </a-button> -->
      </template>
      <template #toolbar-right>
        <a-button v-permission="['system:menu:add']" type="primary" @click="onAdd()">
          <template #icon><icon-plus /></template>
          <template #default>{{ $t('page.common.button.add') }}</template>
        </a-button>
        <a-tooltip :content="`${$t('page.common.button.expand')}/${$t('page.common.button.collapsed')}`">
          <a-button @click="onExpanded">
            <template #icon>
              <icon-list v-if="!isExpanded" />
              <icon-mind-mapping v-else />
            </template>
          </a-button>
        </a-tooltip>
      </template>
      <template #title="{ record }">
        <GiSvgIcon :name="record.icon" :size="15" />
        <span style="margin-left: 5px; vertical-align: middle">{{ record.locale ? $t(record.locale) : record.title }}</span>
      </template>
      <template #type="{ record }">
        <a-tag v-if="record.type === 1" color="arcoblue">{{ $t('sys.menu.type.t1') }}</a-tag>
        <a-tag v-if="record.type === 2" color="green">{{ $t('sys.menu.type.t2') }}</a-tag>
        <a-tag v-if="record.type === 3">{{ $t('sys.menu.type.t3') }}</a-tag>
      </template>
      <template #status="{ record }">
        <GiCellStatus :status="record.status" />
      </template>
      <template #isExternal="{ record }">
        <a-tag v-if="record.isExternal" color="arcoblue" size="small">{{ $t('page.common.field.true') }}</a-tag>
        <a-tag v-else color="red" size="small">{{ $t('page.common.field.false') }}</a-tag>
      </template>
      <template #isHidden="{ record }">
        <a-tag v-if="record.isHidden" color="arcoblue" size="small">{{ $t('page.common.field.true') }}</a-tag>
        <a-tag v-else color="red" size="small">{{ $t('page.common.field.false') }}</a-tag>
      </template>
      <template #isCache="{ record }">
        <a-tag v-if="record.isCache" color="arcoblue" size="small">{{ $t('page.common.field.true') }}</a-tag>
        <a-tag v-else color="red" size="small">{{ $t('page.common.field.false') }}</a-tag>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['system:menu:update']" :title="$t('page.common.button.modify')" @click="onUpdate(record)">{{ $t('page.common.button.modify') }}</a-link>
          <a-link v-permission="['system:menu:delete']" status="danger" :title="$t('page.common.button.delete')" @click="onDelete(record)">{{ $t('page.common.button.delete') }}</a-link>
          <a-link
            v-permission="['system:menu:add']"
            :disabled="![1, 2].includes(record.type)"
            :title="![1, 2].includes(record.type) ? $t('sys.menu.tips.notAdd') : $t('page.common.button.add')"
            @click="onAdd(record.id)"
          >
            {{ $t('page.common.button.add') }}
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <MenuAddModal ref="MenuAddModalRef" :menus="dataList" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MenuAddModal from './MenuAddModal.vue'
import { type MenuQuery, type MenuResp, deleteMenu, listMenu } from '@/apis/system/menu'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import type GiTable from '@/components/GiTable/index.vue'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'SystemMenu' })
const { t } = useI18n()
const queryForm = reactive<MenuQuery>({})

const {
  tableData,
  loading,
  search,
  handleDelete,
} = useTable(() => listMenu(queryForm), { immediate: true })

// 过滤树
const searchData = (title: string) => {
  const loop = (data: MenuResp[]) => {
    const result = [] as MenuResp[]
    data.forEach((item: MenuResp) => {
      if (item.title?.toLowerCase().includes(title.toLowerCase())) {
        result.push({ ...item })
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData,
          })
        }
      }
    })
    return result
  }
  return loop(tableData.value)
}

const title = ref('')
const dataList = computed(() => {
  if (!title.value) return tableData.value
  return searchData(title.value)
})

const columns: ComputedRef<TableInstanceColumns[]> = computed(() => [
  { title: t('sys.menu.field.title'), dataIndex: 'title', slotName: 'title', width: 170, fixed: !isMobile() ? 'left' : undefined },
  { title: t('sys.menu.field.type'), dataIndex: 'type', slotName: 'type', align: 'center' },
  { title: t('sys.menu.field.status'), dataIndex: 'status', slotName: 'status', align: 'center' },
  { title: t('sys.menu.field.sort'), dataIndex: 'sort', align: 'center', show: false },
  { title: t('sys.menu.field.path'), dataIndex: 'path', ellipsis: true, tooltip: true },
  { title: t('sys.menu.field.name'), dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: t('sys.menu.field.component'), dataIndex: 'component', minWidth: 180, ellipsis: true, tooltip: true },
  { title: t('sys.menu.field.permission'), dataIndex: 'permission', minWidth: 180, ellipsis: true, tooltip: true },
  { title: t('sys.menu.field.isExternal'), dataIndex: 'isExternal', slotName: 'isExternal', align: 'center' },
  { title: t('sys.menu.field.isHidden'), dataIndex: 'isHidden', slotName: 'isHidden', align: 'center' },
  { title: t('sys.menu.field.isCache'), dataIndex: 'isCache', slotName: 'isCache', align: 'center' },
  { title: t('sys.menu.field.createUser'), dataIndex: 'createUserString', ellipsis: true, tooltip: true, show: false },
  { title: t('sys.menu.field.createTime'), dataIndex: 'createTime', width: 180 },
  { title: t('sys.menu.field.updateUser'), dataIndex: 'updateUserString', ellipsis: true, tooltip: true, show: false },
  { title: t('sys.menu.field.updateTime'), dataIndex: 'updateTime', width: 180, show: false },
  {
    title: t('page.common.button.operator'),
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['system:menu:update', 'system:menu:delete', 'system:menu:add']),
  },
])

// 重置
const reset = () => {
  title.value = ''
}

// 删除
const onDelete = (record: MenuResp) => {
  return handleDelete(() => deleteMenu(record.id), {
    content: `${t('sys.menu.tips.delete')}「${record.title}」？`,
    showModal: true,
  })
}

const isExpanded = ref(false)
const tableRef = ref<InstanceType<typeof GiTable>>()
// 展开/折叠
const onExpanded = () => {
  isExpanded.value = !isExpanded.value
  tableRef.value?.tableRef?.expandAll(isExpanded.value)
}

const MenuAddModalRef = ref<InstanceType<typeof MenuAddModal>>()
// 新增
const onAdd = (parentId?: string) => {
  MenuAddModalRef.value?.onAdd(parentId)
}

// 修改
const onUpdate = (record: MenuResp) => {
  MenuAddModalRef.value?.onUpdate(record.id)
}
</script>

<style scoped lang="scss"></style>
