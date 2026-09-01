import http from '@/utils/http'
import { useTenantStore } from '@/stores/modules/tenant'

const BASE_URL = '/tenant/common'

export type TenantAuthMode = 'PLATFORM' | 'DOMAIN' | 'LEGACY'

export interface TenantAuthContextResp {
  mode: TenantAuthMode
  tenantEnabled: boolean
}

/** @desc 查询当前租户认证入口 */
export function getTenantAuthContext() {
  // 后端根据请求 Host 返回 PLATFORM、DOMAIN 或 LEGACY，前端不自行推断租户归属。
  return http.get<TenantAuthContextResp>(`${BASE_URL}/context`)
}

let tenantAuthContextPromise: Promise<void> | null = null

/** @desc 初始化当前租户认证入口（应用生命周期内只请求一次） */
export function ensureTenantAuthContext() {
  if (!tenantAuthContextPromise) {
    // 同一页面生命周期只初始化一次，避免路由切换时重复请求并覆盖租户状态。
    tenantAuthContextPromise = getTenantAuthContext()
      .then(({ data }) => {
        useTenantStore().setAuthContext(data.mode, data.tenantEnabled)
      })
      .catch((error) => {
        tenantAuthContextPromise = null
        throw error
      })
  }
  return tenantAuthContextPromise
}

/** @desc 根据域名查询租户 ID */
export function getTenantIdByDomain(domain: string) {
  return http.get<string>(`${BASE_URL}/id`, { domain })
}
