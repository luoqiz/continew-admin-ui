<template>
  <a-range-picker
    :placeholder="placeholder"
    :format="format"
    :show-time="showTime"
    :shortcuts="shortcuts"
    shortcuts-position="left"
    style="height: 32px"
    :allow-clear="allowClear"
  />
</template>

<script setup lang="ts">
import type { ShortcutType } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'DateRangePicker' })

defineProps({
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
  },
  showTime: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: Array as PropType<string[]>,
    default: (): string[] => ['开始时间', '结束时间'],
  },
  allowClear: {
    type: Boolean,
    default: true,
  },
})

const { t } = useI18n()

const shortcuts = computed<ShortcutType[]>(() => {
  return [
    {
      label: t('page.common.tips.today'),
      value: (): Date[] => [dayjs().startOf('day').toDate(), dayjs().toDate()],
    },
    {
      label: t('page.common.tips.yesterday'),
      value: (): Date[] => [
        dayjs().subtract(1, 'day').startOf('day').toDate(),
        dayjs().subtract(1, 'day').endOf('day').toDate(),
      ],
    },
    {
      label: t('page.common.tips.thisWeek'),
      value: (): Date[] => [dayjs().startOf('week').add(1, 'day').toDate(), dayjs().toDate()],
    },
    {
      label: t('page.common.tips.thisMonth'),
      value: (): Date[] => [dayjs().startOf('month').toDate(), dayjs().toDate()],
    },
    {
      label: t('page.common.tips.thisYear'),
      value: (): Date[] => [dayjs().startOf('year').toDate(), dayjs().toDate()],
    },
  ]
})
</script>

<style scoped lang="less"></style>
