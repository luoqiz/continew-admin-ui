import http from '@/utils/http'

const BASE_URL = '/wms/goodsInventoryCount'

export interface GoodsInventoryCountResp {
  id: string
  name: string
  whseId: string
  status: number
  startTime: string
  endTime: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsInventoryCountDetailResp {
  id: string
  name: string
  whseId: string
  whseName: string
  whseAreaId: string
  status: number
  startTime: string
  endTime: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsInventoryCountQuery {
  name: string | undefined
  whseId: string | undefined
  status: string | undefined
  sort: Array<string>
}
export interface GoodsInventoryCountPageQuery extends GoodsInventoryCountQuery, PageQuery {}

/** @desc 查询物料盘点列表 */
export function listGoodsInventoryCount(query: GoodsInventoryCountPageQuery) {
  return http.get<PageRes<GoodsInventoryCountResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询物料盘点详情 */
export function getGoodsInventoryCount(id: string) {
  return http.get<GoodsInventoryCountDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增物料盘点 */
export function addGoodsInventoryCount(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改物料盘点 */
export function updateGoodsInventoryCount(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除物料盘点 */
export function deleteGoodsInventoryCount(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出物料盘点 */
export function exportGoodsInventoryCount(query: GoodsInventoryCountQuery) {
  return http.download(`${BASE_URL}/export`, query)
}

/** @desc 更新物料盘点状态 */
export function updateGoodsInventoryCountStatus(id: string, status: number) {
  return http.put(`${BASE_URL}/status/${id}/${status}`)
}

/** @desc 导出物料盘点详情 */
export function exportGoodsInventoryCountDetail(id: string) {
  return http.download(`${BASE_URL}/export/${id}`)
}
