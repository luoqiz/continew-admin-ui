import http from '@/utils/http'

const BASE_URL = '/wms/whseStockOutDetail'

export interface WhseStockOutDetailResp {
  id: string
  stockOutId: string
  goodsSku: string
  goodsName: string
  prodTime: string
  expiryTime: string
  planNum: string
  realNum: string
  memo: string
  status: number
  createUser: string
  createTime: string
  createUserString: string
  updateUserString: string
}
export interface WhseStockOutDetailDetailResp {
  id: string
  stockOutId: string
  goodsSku: string
  goodsName: string
  prodTime: string
  expiryTime: string
  planNum: string
  realNum: string
  memo: string
  status: number
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface WhseStockOutDetailQuery {
  stockOutId: string | undefined
  goodsSku: string | undefined
  goodsName: string | undefined
  sort: Array<string>
}
export interface WhseStockOutDetailPageQuery extends WhseStockOutDetailQuery, PageQuery {}

/** @desc 查询仓库出库明细列表 */
export function listWhseStockOutDetail(query: WhseStockOutDetailPageQuery) {
  return http.get<PageRes<WhseStockOutDetailResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询仓库出库明细详情 */
export function getWhseStockOutDetail(id: string) {
  return http.get<WhseStockOutDetailDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增仓库出库明细 */
export function addWhseStockOutDetail(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改仓库出库明细 */
export function updateWhseStockOutDetail(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除仓库出库明细 */
export function deleteWhseStockOutDetail(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出仓库出库明细 */
export function exportWhseStockOutDetail(query: WhseStockOutDetailQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
