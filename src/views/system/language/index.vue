<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import LanguageAddModal from './LanguageAddModal.vue'
import { type LanguageQuery, type LanguageResp, deleteLanguage, getLanguage, listLanguage, updateLanguage } from '@/apis/system/language'
import { useDict } from '@/hooks/app'
import { useDeleteDialog } from '@/hooks/modules/useDeleteDialog'

defineOptions({ name: 'Language' })

const { language_type } = useDict('language_type')

const queryForm = reactive<LanguageQuery>({
  moduleId: undefined,
  moduleName: undefined,
  content: undefined,
  dictItem: undefined,
  status: undefined,
  createUser: undefined,
  createTime: undefined,
  sort: ['createTime,desc'],
})

const dataList = ref([], { immediate: true })
// 获取列表
const search = async () => {
  const data = await listLanguage({ ...queryForm, page: 1, size: 1000 })
  dataList.value = data.data.list
}

// 删除
const onDelete = (record: LanguageResp) => {
  return useDeleteDialog(() => deleteLanguage(record.id), () => {
    search()
  }, {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

const LanguageAddModalRef = ref<InstanceType<typeof LanguageAddModal>>()
// 新增
const onAdd = () => {
  LanguageAddModalRef.value?.onAdd()
}

const currentModule = ref<LanguageResp>()

// 更换模块
const changeModule = async (item) => {
  const res = await getLanguage(item.id)
  currentModule.value = res.data
}

const saveContent = async () => {
  const res = await updateLanguage(currentModule.value, currentModule.value!.id)
  if (res.success) {
    Message.success('修改成功')
  } else {
    Message.error('修改失败')
  }
}

onMounted(() => { search() })

// const cmRef = ref()

// const cmOptions = {
//   mode: 'text/x-yaml',
//   extraKeys: {
//     Tab: newTab
//   }
// }

// onUnmounted(() => {
//   cmRef.value?.destroy()
// })

// function newTab(cm) {
//   if (cm.somethingSelected()) {
//     cm.indentSelection('add')
//   } else {
//     const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
//     cm.replaceSelection(spaces)
//   }
// }
</script>

<template>
  <div class="table-page">
    <a-row justify="space-between" align="center" class="header page_header">
      <a-space wrap>
        <div class="title">语言管理</div>
      </a-space>
    </a-row>
    <a-row justify="space-between" align="center" class="header page_header">
      <a-space wrap>
        <a-radio-group v-model="queryForm.dictItem" type="button" @change="search">
          <a-radio key="all" value="">全部</a-radio>
          <a-radio v-for="item of language_type" :key="item.value" :value="item.value"> {{ item.label }}</a-radio>
        </a-radio-group>
      </a-space>
    </a-row>
    <a-row align="stretch" :gutter="14" class="flex-1 h-full page_content">
      <a-col :xs="0" :sm="0" :md="6" :lg="5" :xl="5" :xxl="4" class="h-full ov-hidden">
        <div class="left-tree">
          <div class="left-tree__search flex flex-row">
            <a-input v-model="queryForm.moduleName" placeholder="请输入模块名称" allow-clear>
              <template #prefix><icon-search /></template>
            </a-input>
            <button class="m-2" size="large" @click="onAdd">
              <icon-plus />
            </button>
          </div>
          <div class="left-tree__container mt-4">
            <div class="left-tree__tree">
              <a-list size="small">
                <a-list-item v-for="item in dataList" :key="item.id" :class="currentModule?.id === item.id ? 'bg-blue-2' : ''" @click="changeModule(item)">
                  {{ item.moduleName }}
                  <template #actions>
                    <a-link
                      v-permission="['generator:language:delete']"
                      status="danger"
                      @click="onDelete(item)"
                    >
                      <icon-delete />
                    </a-link>
                  </template>
                </a-list-item>
              </a-list>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="18" :lg="19" :xl="19" :xxl="20" class="h-full w-full ov-hidden flex flex-row">
        <div v-if="currentModule" class="w-full h-full">
          <a-row>
            <p class="text-slate-950">
              <!-- {{ currentModule.moduleName }} -- {{ currentModule.dictItem }} -->
            </p>
            <a-button
              @click="saveContent"
            >
              保存
            </a-button>
          </a-row>
          <a-row class="h-full m-t-32px">
            <div class="w-full h-full">
              <div style="height: calc(100% - 64px); width: 100%;">
                <GiCodeView v-model="currentModule.content" type="properties" :config="{ readonly: false, tabSize: 2 }"></GiCodeView>
              </div>
            </div>
          </a-row>
        </div>
      </a-col>
    </a-row>
    <LanguageAddModal ref="LanguageAddModalRef" @save-success="search" />
  </div>
</template>

<style lang="scss" scoped>
.page_header {
  flex: 0 0 auto;
}

.page_content {
  flex: 1;
  overflow: auto;
}
</style>
