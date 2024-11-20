<template>
  <div class="gi_page container">
    <a-space direction="vertical" :size="14" fill>
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
import DataOverview from './components/DataOverview/index.vue'
import Expired15 from './components/expired15.vue'
import Expired30 from './components/expired30.vue'
import Expired45 from './components/expired45.vue'
import AccessTimeslot from '@/views/dashboard/analysis/components/AccessTimeslot.vue'

defineOptions({ name: 'Analysis' })
</script>

<style scoped lang="scss"></style>
