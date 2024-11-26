import http from '@/utils/http'

const BASE_URL = '/wms/whseStockIn'

export interface WhseStockInResp {
  id: string
  name: string
  stockInNo: string
  whseId: string
  stockMoveId: string
  inTime: string
  status: number
  memo: string
  createUser: string
  createTime: string
  createUserString: string
  updateUserString: string
}
export interface WhseStockInInfoResp {
  id: string
  name: string
  stockInNo: string
  stockInType: string
  whseId: string
  whseName: string
  whseAreaId: string
  stockMoveId: string
  inTime: string
  status: number
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
  goodsList: []
}
export interface WhseStockInQuery {
  name: string | undefined
  stockInNo: string | undefined
  whseId: Array<string> | undefined
  status: string | undefined
  sort: Array<string>
}
export interface WhseStockInPageQuery extends WhseStockInQuery, PageQuery {}

/** @desc 查询仓库入库列表 */
export function listWhseStockIn(query: WhseStockInPageQuery) {
  return http.get<PageRes<WhseStockInResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询仓库入库详情 */
export function getWhseStockIn(id: string) {
  return http.get<WhseStockInInfoResp>(`${BASE_URL}/${id}`)
}

/** @desc 查询仓库入库详情 */
export function getWhseStockInInfo(id: string) {
  return http.get<WhseStockInInfoResp>(`${BASE_URL}/detail/${id}`)
}

/** @desc 新增仓库入库 */
export function addWhseStockIn(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改仓库入库 */
export function updateWhseStockIn(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除仓库入库 */
export function deleteWhseStockIn(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出仓库入库 */
export function exportWhseStockIn(query: WhseStockInQuery) {
  return http.download(`${BASE_URL}/export`, query)
}

/** @desc 更新仓库入库状态 */
export function updateWhseStockInStatus(id: string, status: number) {
  return http.put(`${BASE_URL}/status/${id}/${status}`)
}

/** @desc 导出仓库入库 */
export function exportWhseStockInInfo(id: string) {
  return http.download(`${BASE_URL}/export/${id}`)
}
