<template>
  <div class="codeView">
    <CodeMirror
      v-model="modelProps"
      :tab-size="config.tabSize"
      :basic="config.basic"
      :dark="config.dark"
      :readonly="config.readonly"
      :extensions="extensions"
    />
  </div>
</template>

<script setup lang="ts">
import CodeMirror from 'vue-codemirror6'
import { javascript } from '@codemirror/lang-javascript'
import { vue } from '@codemirror/lang-vue'
import { githubLight } from '@ddietr/codemirror-themes/github-light'
import { oneDark } from '@codemirror/theme-one-dark'
import { yaml } from '@codemirror/lang-yaml'
import { StreamLanguage } from '@codemirror/language'
import { properties } from '@codemirror/legacy-modes/mode/properties'
import { useAppStore } from '@/stores'

const props = withDefaults(defineProps<Props>(), {
  type: 'javascript',
  modelValue: '',
})
const emits = defineEmits(['update:modelValue'])
const appStore = useAppStore()
const isDark = computed(() => appStore.theme === 'dark')

interface Props {
  type?: 'javascript' | 'vue' | 'yaml' | 'properties'
  modelValue?: string
  config?: any
}
const defaultConfig = {
  tab: true,
  tabSize: 2,
  basic: true,
  dark: true,
  readonly: true,
  lineNumbers: true,
  lineCount: 50,
}

const config = Object.assign({}, defaultConfig, props.config)

const extensions = computed(() => {
  const arr = [isDark.value ? oneDark : githubLight]
  if (props.type === 'javascript') {
    arr.push(javascript())
  }
  if (props.type === 'vue') {
    arr.push(vue())
  }
  if (props.type === 'yaml') {
    arr.push(yaml())
  }
  if (props.type === 'properties') {
    arr.push(StreamLanguage.define(properties))
  }
  return arr
})

const modelProps = ref()

watchEffect(() => {
  modelProps.value = props.modelValue ?? ''
})
watch(
  () => modelProps.value,
  () => {
    emits('update:modelValue', modelProps.value)
  },
)
</script>

<style scoped lang="scss">
:deep(.ͼ1 .cm-scroller) {
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
}

.codeView{
  height: 100%;
  overflow: scroll;
  border: 1px solid;
}
</style>
