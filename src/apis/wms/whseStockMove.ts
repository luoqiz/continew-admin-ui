import http from '@/utils/http'

const BASE_URL = '/wms/whseStockMove'

export interface WhseStockMoveResp {
  id: string
  name: string
  stockMoveNo: string
  stockMoveType: string
  stockInWhseId: string
  stockOutWhseId: string
  moveTime: string
  status: string
  stockInId: string
  stockOutId: string
  memo: string
  createUser: string
  createTime: string
  createUserString: string
  updateUserString: string
}
export interface WhseStockMoveDetailResp {
  id: string
  name: string
  stockMoveNo: string
  stockMoveType: string
  stockInWhseId: string
  stockInWhseName: string
  stockInWhseAreaId: string
  stockOutWhseId: string
  stockOutWhseName: string
  stockOutWhseAreaId: string
  moveTime: string
  status: number
  stockInId: string
  stockOutId: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
  goodsList: []
}
export interface WhseStockMoveQuery {
  name: string | undefined
  stockMoveNo: string | undefined
  stockMoveType: string | undefined
  stockInWhseId: string | undefined
  stockOutWhseId: string | undefined
  status: string | undefined
  sort: Array<string>
}
export interface WhseStockMovePageQuery extends WhseStockMoveQuery, PageQuery {}

/** @desc 查询仓库移库列表 */
export function listWhseStockMove(query: WhseStockMovePageQuery) {
  return http.get<PageRes<WhseStockMoveResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询仓库移库详情 */
export function getWhseStockMove(id: string) {
  return http.get<WhseStockMoveDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增仓库移库 */
export function addWhseStockMove(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改仓库移库 */
export function updateWhseStockMove(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除仓库移库 */
export function deleteWhseStockMove(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出仓库移库 */
export function exportWhseStockMove(query: WhseStockMoveQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
