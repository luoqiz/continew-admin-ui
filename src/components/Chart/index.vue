<template>
  <VChart ref="chart" :option="option" :autoresize="autoResize" :style="{ width, height }" />
</template>

<script setup lang="ts">
import { registerMap, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide, ref } from 'vue'

import worldMap from './world.json'
import chinaMap from './china.json'

defineProps({
  option: {
    type: Object,
    default() {
      return {}
    },
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

// registerMap('world', worldMap)
// registerMap('china', chinaMap)

const chart = ref(null)
defineExpose({
  chart,
})
</script>

<style scoped lang="less"></style>
