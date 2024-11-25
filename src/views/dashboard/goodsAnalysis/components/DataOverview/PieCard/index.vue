<template>
  <a-spin :loading="loading" style="width: 100%;">
    <a-card
      class="general-card"
      :style="{
        background: isDark
          ? 'linear-gradient(180deg, #312565 0%, #201936 100%)'
          : 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
      }"
    >
      <div class="content-wrap">
        <div class="content">
          <a-statistic
            :title="title"
            :value="count"
            :value-from="0"
            animation
            show-group-separator
          />
        </div>
        <div class="chart">
          <Chart v-if="!loading" :option="chartOption" />
        </div>
      </div>
    </a-card>
  </a-spin>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChart } from '@/hooks'
import { useAppStore } from '@/stores'

const { title, data: chartData } = defineProps<{
  title: string
  data: { name: string, value: number }[]
  loading: boolean
}>()

const Chart = defineAsyncComponent(() => import('@/components/Chart/index.vue'))
const appStore = useAppStore()
const isDark = computed(() => appStore.theme === 'dark')

const count = computed(() => chartData.reduce((sum, item) => sum + Number(item.value || 0), 0))

const { chartOption } = useChart(() => {
  return {
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    // title: {
    //   text: 'Traffic Sources',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
      show: true,
    },
    legend: {
      left: 'left',
      show: true,
      top: 'center',
      right: '20%',
      orient: 'vertical',
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      textStyle: {
        color: '#4E5969',
      },
      data: chartData.map((item) => item.name),
    },
    series: [
      {
        name: '总计',
        type: 'pie',
        // radius: '55%',
        // center: ['50%', '60%'],
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        label: {
          show: false,
        },
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
})
</script>

<style scoped lang="less">
:deep(.arco-card) {
  border-radius: 4px;
}
:deep(.arco-card-body) {
  width: 100%;
  height: 134px;
  padding: 0;
}
.content-wrap {
  width: 100%;
  padding: 16px;
  white-space: nowrap;
}
:deep(.content) {
  float: left;
  width: 108px;
  height: 102px;
}
:deep(.arco-statistic) {
  .arco-statistic-title {
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
  }
  .arco-statistic-content {
    margin-top: 10px;
  }
}

.chart {
  float: right;
  width: calc(100% - 108px);
  height: 90px;
  vertical-align: bottom;
}

.label {
  padding-right: 8px;
  font-size: 12px;
}
</style>
