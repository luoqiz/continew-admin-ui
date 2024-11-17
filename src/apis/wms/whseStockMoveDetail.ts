import http from '@/utils/http'

const BASE_URL = '/wms/whseStockMoveDetial'

export interface WhseStockMoveDetialResp {
  id: string
  stockMoveNo: string
  goodsStockId: string
  goodsSku: string
  goodsName: string
  moveTime: string
  prodTime: string
  expiryTime: string
  planNum: string
  memo: string
  createUser: string
  createTime: string
  createUserString: string
  updateUserString: string
}
export interface WhseStockMoveDetialDetailResp {
  id: string
  stockMoveNo: string
  goodsStockId: string
  goodsSku: string
  goodsName: string
  moveTime: string
  prodTime: string
  expiryTime: string
  planNum: string
  realNum: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
  goodsList: []
}
export interface WhseStockMoveDetialQuery {
  stockMoveId: string | undefined
  stockMoveNo: string | undefined
  goodsStockId: string | undefined
  goodsSku: string | undefined
  goodsName: string | undefined
  moveTime: string | undefined
  prodTime: string | undefined
  expiryTime: string | undefined
  sort: Array<string>
}
export interface WhseStockMoveDetialPageQuery extends WhseStockMoveDetialQuery, PageQuery {}

/** @desc 查询仓库移库明细列表 */
export function listWhseStockMoveDetial(query: WhseStockMoveDetialPageQuery) {
  return http.get<PageRes<WhseStockMoveDetialResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询仓库移库明细详情 */
export function getWhseStockMoveDetail(id: string) {
  return http.get<WhseStockMoveDetialDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增仓库移库明细 */
export function addWhseStockMoveDetail(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改仓库移库明细 */
export function updateWhseStockMoveDetial(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除仓库移库明细 */
export function deleteWhseStockMoveDetial(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出仓库移库明细 */
export function exportWhseStockMoveDetial(query: WhseStockMoveDetialQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}
