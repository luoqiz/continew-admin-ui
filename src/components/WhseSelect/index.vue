<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listAddrByUser } from '@/apis/wms'

interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})
const emits = defineEmits(['update:modelValue'])

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

<template>
  <div class="">
    <a-select v-model="modelProps" :style="{ width: '320px' }" placeholder="" allow-search :options="options">
    </a-select>
  </div>
</template>

<style lang="scss" scoped>

</style>
