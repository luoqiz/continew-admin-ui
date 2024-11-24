import { listAddrByUser } from '@/apis/wms/addr'

export function useWhseAddr() {
  const loaded = ref<boolean>(false)
  const whseAddrOptions = ref([])

  listAddrByUser().then((res) => {
    loaded.value = false
    for (const item of res.data) {
      whseAddrOptions.value.push({ label: item.name, value: item.id })
    }
    console.log('listAddrByUser  then', loaded)
  }).finally(() => {
    console.log('listAddrByUser', loaded)
    loaded.value = true
  })

  return { whseAddrOptions, loaded }
}
