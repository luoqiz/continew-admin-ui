import type * as T from './type'
import http from '@/utils/http'

export type * from './type'

const BASE_URL = '/auth'

const login = (req: T.AccountLoginReq | T.PhoneLoginReq | T.EmailLoginReq, tenantCode?: string) => {
  const headers: Record<string, string> = {}
  // 仅兼容入口需要显式传租户编码；域名入口不传，由后端从 Host 确定租户。
  if (tenantCode) {
    headers['X-Tenant-Code'] = tenantCode
  }
  return http.post<T.LoginResp>(`${BASE_URL}/login`, req, {
    headers,
  })
}

/** @desc 账号登录 */
export function accountLogin(req: T.AccountLoginReq, tenantCode?: string) {
  return login(req, tenantCode)
}

/** @desc 邮箱登录 */
export function emailLogin(req: T.EmailLoginReq, tenantCode?: string) {
  return login(req, tenantCode)
}

/** @desc 手机号登录 */
export function phoneLogin(req: T.PhoneLoginReq, tenantCode?: string) {
  return login(req, tenantCode)
}

/** @desc 三方账号登录 */
export function socialLogin(req: any, tenantCode?: string) {
  return login(req, tenantCode)
}

/** @desc 三方账号登录授权 */
export function socialAuth(source: string, tenantCode?: string) {
  const headers: Record<string, string> = {}
  // 社交授权阶段同样只为无域名租户携带旧模式租户编码。
  if (tenantCode) {
    headers['X-Tenant-Code'] = tenantCode
  }
  return http.get<T.SocialAuthAuthorizeResp>(`${BASE_URL}/${source}`, undefined, { headers })
}

/** @desc 查询社交登录回调目标 */
export function resolveSocialTarget(state: string) {
  return http.get<T.SocialAuthTargetResp>(`${BASE_URL}/social/target`, { state })
}

/** @desc 退出登录 */
export function logout() {
  return http.post(`${BASE_URL}/logout`)
}

/** @desc 获取用户信息 */
export const getUserInfo = () => {
  return http.get<T.UserInfo>(`${BASE_URL}/user/info`)
}

/** @desc 获取路由信息 */
export const getUserRoute = () => {
  return http.get<T.RouteItem[]>(`${BASE_URL}/user/route`)
}
