<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ name: 'CustomWhseSelect' })

const { options } = defineProps({ options: { type: Array<any>, default: [] } })
const modelValue = defineModel({ type: Array<any> || String })

const attrs = useAttrs()
</script>

<template>
  <div class="w-full">
    <a-select
      v-model="modelValue"
      v-bind="attrs" :style="{ width: '100%' }"
      allow-clear
      allow-search
      :options="options"
    >
    </a-select>
  </div>
</template>

<style lang="scss" scoped>
</style>
