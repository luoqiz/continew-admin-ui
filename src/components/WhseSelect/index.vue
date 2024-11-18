<script setup lang="ts">
import { onMounted, ref, useAttrs } from 'vue'
import { listAddrByUser } from '@/apis/wms'

defineOptions({ name: 'CustomWhseSelect' })

const modelValue = defineModel()

const attrs = useAttrs()

const options = ref([
])
const getWhseList = async () => {
  const res = await listAddrByUser()
  const temp = []
  for (const item of res.data) {
    temp.push({ label: item.name, value: item.id })
  }
  options.value = temp
}

onMounted(async () => {
  await getWhseList()
})
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
