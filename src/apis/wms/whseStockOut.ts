import http from '@/utils/http'

const BASE_URL = '/wms/whseStockOut'

export interface WhseStockOutResp {
  id: string
  name: string
  stockOutNo: string
  stockOutType: string
  whseId: string
  whseAreaId: string
  stockMoveId: string
  outTime: string
  status: number
  createUser: string
  createTime: string
  createUserString: string
  updateUserString: string
}
export interface WhseStockOutInfoResp {
  id: string
  name: string
  stockOutNo: string
  stockOutType: string
  whseId: string
  whseName: string
  whseAreaId: string
  stockMoveId: string
  outTime: string
  status: number
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
  goodsList: []
}
export interface WhseStockOutQuery {
  name: string | undefined
  stockOutNo: string | undefined
  whseId: string | undefined
  status: string | undefined
  sort: Array<string>
}
export interface WhseStockOutPageQuery extends WhseStockOutQuery, PageQuery {}

/** @desc 查询仓库出库列表 */
export function listWhseStockOut(query: WhseStockOutPageQuery) {
  return http.get<PageRes<WhseStockOutResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询仓库出库详情 */
export function getWhseStockOut(id: string) {
  return http.get<WhseStockOutInfoResp>(`${BASE_URL}/${id}`)
}

/** @desc 查询仓库出库明细详情 */
export function getWhseStockOutInfo(id: string) {
  return http.get<WhseStockOutInfoResp>(`${BASE_URL}/detail/${id}`)
}

/** @desc 新增仓库出库 */
export function addWhseStockOut(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改仓库出库 */
export function updateWhseStockOut(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除仓库出库 */
export function deleteWhseStockOut(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出仓库出库 */
export function exportWhseStockOut(query: WhseStockOutQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}

/** @desc 更新仓库出库状态 */
export function updateWhseStockOutStatus(id: string, status: number) {
  return http.put(`${BASE_URL}/status/${id}/${status}`)
}

/** @desc 统计今日仓库 */
export function staticsStockOutToday(whseId: string) {
  return http.get(`${BASE_URL}/statics/${whseId}`)
}

/** @desc 导出仓库出库单 */
export function exportWhseStockOutInfo(id: string) {
  return http.download(`${BASE_URL}/export/${id}`)
}
