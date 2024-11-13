import http from '@/utils/http'

const BASE_URL = '/wms/whseStockInDetail'

export interface WhseStockInDetailResp {
  id: string
  stockInId: string
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
export interface WhseStockInDetailDetailResp {
  id: string
  stockInId: string
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
export interface WhseStockInDetailQuery {
  stockInId: string | undefined
  goodsSku: string | undefined
  goodsName: string | undefined
  sort: Array<string>
}
export interface WhseStockInDetailPageQuery extends WhseStockInDetailQuery, PageQuery {}

/** @desc 查询仓库入库明细列表 */
export function listWhseStockInDetail(query: WhseStockInDetailPageQuery) {
  return http.get<PageRes<WhseStockInDetailResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询仓库入库明细详情 */
export function getWhseStockInDetail(id: string) {
  return http.get<WhseStockInDetailDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增仓库入库明细 */
export function addWhseStockInDetail(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改仓库入库明细 */
export function updateWhseStockInDetail(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除仓库入库明细 */
export function deleteWhseStockInDetail(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出仓库入库明细 */
export function exportWhseStockInDetail(query: WhseStockInDetailQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}
