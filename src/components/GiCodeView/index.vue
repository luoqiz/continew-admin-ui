<template>
    <CodeMirror
    :model-value="codeValue"
    :tab-size="config.tabSize"
    :basic="config.basic"
    :dark="config.dark"
    :readonly="config.readonly"
    :extensions="extensions"
    style="height: 100%; border-width:1px; border-style:solid;"
    />
</template>

<script lang="ts" setup>
import CodeMirror from 'vue-codemirror6'
import { javascript } from '@codemirror/lang-javascript'
import { vue } from '@codemirror/lang-vue'
import { githubLight } from '@ddietr/codemirror-themes/github-light'
import { oneDark } from '@codemirror/theme-one-dark'
import { yaml } from '@codemirror/lang-yaml'
import { useAppStore } from '@/stores'

const props = withDefaults(defineProps<Props>(), {
  type: 'javascript',
  codeJson: '',
})
const appStore = useAppStore()
const isDark = computed(() => appStore.theme === 'dark')

interface Props {
  type?: 'javascript' | 'vue' | 'yaml'
  codeJson: string
  config: any
}
const defaultConfig = {
  tabSize: 2,
  basic: true,
  dark: true,
  readonly: true,
}
const config = Object.assign({}, defaultConfig, props.config)

const codeValue = computed(() => props.codeJson)

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
  return arr
})
</script>

<style lang="scss" scoped>
:deep(.ͼ1 .cm-scroller) {
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
}
</style>
