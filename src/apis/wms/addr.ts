import http from '@/utils/http'

const BASE_URL = '/wms/addr'

export interface AddrResp {
  id: string
  whseNo: string
  name: string
  addr: string
  whseType: string
  status: string
  memo: string
  deptId: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface AddrDetailResp {
  id: string
  whseNo: string
  name: string
  addr: string
  whseType: number
  status: string
  memo: string
  deptId: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface AddrQuery {
  whseNo: string
  name: string
  status: string
  whseType: number
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  sort: Array<string>
}
export interface AddrPageQuery extends AddrQuery, PageQuery {}

/** @desc 查询仓库地址列表 */
export function listAddr(query: AddrPageQuery) {
  return http.get<PageRes<AddrResp[]>>(`${BASE_URL}`, query)
}

export function listAddrStore(query: AddrPageQuery) {
  return http.get<PageRes<AddrResp[]>>(`${BASE_URL}/store`, query)
}

export function listAddrRegion(query: AddrPageQuery) {
  return http.get<PageRes<AddrResp[]>>(`${BASE_URL}/region`, query)
}

export function listAddrCountry(query: AddrPageQuery) {
  return http.get<PageRes<AddrResp[]>>(`${BASE_URL}/country`, query)
}

/** @desc 查询仓库地址详情 */
export function getAddr(id: string) {
  return http.get<AddrDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增仓库地址 */
export function addAddr(data: any) {
  return http.post(`${BASE_URL}`, data)
}

export function addStore(data: any) {
  return http.post(`${BASE_URL}/store`, data)
}
export function addRegion(data: any) {
  return http.post(`${BASE_URL}/region`, data)
}
export function addCountry(data: any) {
  return http.post(`${BASE_URL}/country`, data)
}

/** @desc 修改仓库地址 */
export function updateAddr(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除仓库地址 */
export function deleteAddr(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出仓库地址 */
export function exportAddr(query: AddrQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}

// 获取当前用户可操作的仓库
export function listAddrByUser(query?: AddrQuery) {
  return http.get<AddrResp[]>(`${BASE_URL}/all`, query)
}
