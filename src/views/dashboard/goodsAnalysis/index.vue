<template>
  <div class="gi_page container">
    <a-space direction="vertical" :size="14" fill>
      <CustomWhseSelect
        v-model="whseId"
        style="width:240px"
        :options="whseAddrOptions"
        placeholder="请选择仓库"
        @change="changeWhseSelect"
      ></CustomWhseSelect>
      <div>
        <DataOverview />
      </div>

      <div>
        <a-grid :cols="24" :col-gap="12" :row-gap="12">
          <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }">
            <Expired15></Expired15>
          </a-grid-item>
          <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }">
            <Expired30></Expired30>
          </a-grid-item>
          <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }">
            <Expired45></Expired45>
          </a-grid-item>
        </a-grid>
      </div>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import DataOverview from './components/DataOverview/index.vue'
import Expired15 from './components/expired15.vue'
import Expired30 from './components/expired30.vue'
import Expired45 from './components/expired45.vue'
import { useWhseAddr } from '@/hooks'
import CustomWhseSelect from '@/components/WhseSelect/index.vue'

defineOptions({ name: 'Analysis' })
const { whseAddrOptions, loaded } = useWhseAddr()

const whseId = ref()
provide('whseId', whseId)
const changeWhseSelect = () => {
  console.log('changeWhseSelect', whseId.value)
}

watch(loaded, () => {
  if (loaded.value) {
    whseId.value = whseAddrOptions.value.map((item) => item.value)[0]
  }
}, { immediate: true })
</script>

<style scoped lang="scss"></style>
