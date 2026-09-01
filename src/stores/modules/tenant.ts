import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { TenantAuthMode } from '@/apis/tenant/common'

export const TENANT_AUTH_CODE_STORAGE_KEY = 'tenant-auth-code'

export const useTenantStore = defineStore('tenant', () => {
  const tenantEnabled = ref<boolean>(false)
  const tenantId = ref<string>()
  const tenantCode = ref<string>()
  const tenantAuthMode = ref<TenantAuthMode>('LEGACY')

  const setTenantEnable = (status: boolean) => {
    tenantEnabled.value = status
  }
  const setTenantId = (id?: string) => {
    tenantId.value = id
  }

  const setTenantCode = (code?: string) => {
    tenantCode.value = code
  }

  const setAuthContext = (mode: TenantAuthMode, enabled: boolean) => {
    // 每次刷新根据当前 Host 重置入口状态，避免复用上一个租户域名的本地状态。
    tenantAuthMode.value = mode
    tenantEnabled.value = enabled
    if (mode !== 'LEGACY') {
      // 域名入口不需要用户输入租户编码，也不应继续发送旧模式的租户信息。
      tenantId.value = undefined
      tenantCode.value = undefined
    }
  }

  // 判断是否需要用户输入租户编码
  const needInputTenantCode = computed(() => {
    return tenantEnabled.value && tenantAuthMode.value === 'LEGACY' && !tenantId.value
  })

  // 判断租户是否已正确配置
  const isTenantConfigured = computed(() => {
    return !tenantEnabled.value || tenantAuthMode.value !== 'LEGACY' || !!tenantId.value
  })

  const shouldSendTenantHeader = computed(() => {
    // 请求拦截器据此决定是否发送 X-Tenant-Id / X-Tenant-Code 兼容信息。
    return tenantEnabled.value && tenantAuthMode.value === 'LEGACY' && !!tenantId.value
  })

  // 清空租户ID
  const resetTenantId = () => {
    tenantId.value = undefined
    tenantCode.value = undefined
    sessionStorage.removeItem(TENANT_AUTH_CODE_STORAGE_KEY)
  }
  return {
    tenantEnabled,
    tenantId,
    tenantCode,
    tenantAuthMode,
    setTenantEnable,
    setTenantId,
    setTenantCode,
    setAuthContext,
    needInputTenantCode,
    isTenantConfigured,
    shouldSendTenantHeader,
    resetTenantId,
  }
}, {
  persist: { paths: ['tenantEnabled', 'tenantId'], storage: localStorage },
})
