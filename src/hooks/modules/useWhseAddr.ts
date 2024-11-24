import type { AddrQuery } from '@/apis/wms/addr'
import { listAddrByUser } from '@/apis/wms/addr'

export function useWhseAddr(query: AddrQuery) {
  const loaded = ref<boolean>(false)
  const whseAddrOptions = ref<{ label: string, value: any }[]>([])

  listAddrByUser(query).then((res) => {
    loaded.value = false
    for (const item of res.data) {
      whseAddrOptions.value.push({ label: item.name, value: item.id })
    }
  }).finally(() => {
    loaded.value = true
  })

  return { whseAddrOptions, loaded }
}
