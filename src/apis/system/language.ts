import http from '@/utils/http'

const BASE_URL = '/system/language'

export interface LanguageResp {
  id: string
  moduleId: string
  moduleName: string
  content: string
  dictItem: string
  status: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface LanguageDetailResp {
  id: string
  moduleId: string
  moduleName: string
  content: string
  dictItem: string
  status: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface LanguageQuery {
  moduleId: string | undefined
  moduleName: string | undefined
  content: string | undefined
  dictItem: string | undefined
  status: string | undefined
  createUser: string | undefined
  createTime: string | undefined
  sort: Array<string>
}
export interface LanguagePageQuery extends LanguageQuery, PageQuery {}

/** @desc 查询语言列表 */
export function listLanguage(query: LanguagePageQuery) {
  return http.get<PageRes<LanguageResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询语言详情 */
export function getLanguage(id: string) {
  return http.get<LanguageDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增语言 */
export function addLanguage(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改语言 */
export function updateLanguage(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除语言 */
export function deleteLanguage(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出语言 */
export function exportLanguage(query: LanguageQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}

/** @desc 获取语言种类 */
export function getLanguageType() {
  return http.get(`${BASE_URL}/dict`)
}

/** @desc 查询语言详情 */
export function getLanguageByType(type: string) {
  return http.get<LanguageDetailResp>(`${BASE_URL}/type/${type}`)
}
