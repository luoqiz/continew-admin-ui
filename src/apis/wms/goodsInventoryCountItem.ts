import http from '@/utils/http'

const BASE_URL = '/wms/goodsInventoryCountItem'

export interface GoodsInventoryCountItemResp {
  id: string
  inventoryCountId: string
  stockId: string
  goodsId: string
  goodsSku: string
  initNum: number
  realNum: number
  status: number
  prodTime: string
  expiryTime: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsInventoryCountItemDetailResp {
  id: string
  inventoryCountId: string
  stockId: string
  goodsId: string
  goodsSku: string
  initNum: number
  realNum: number
  status: number
  prodTime: string
  expiryTime: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsInventoryCountItemQuery {
  inventoryCountId: string | undefined
  stockId: string | undefined
  goodsId: string | undefined
  goodsSku: string | undefined
  status: string | undefined
  sort: Array<string>
}
export interface GoodsInventoryCountItemPageQuery extends GoodsInventoryCountItemQuery, PageQuery {}

/** @desc 查询物料盘点详情列表 */
export function listGoodsInventoryCountItem(query: GoodsInventoryCountItemPageQuery) {
  return http.get<PageRes<GoodsInventoryCountItemResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询物料盘点详情详情 */
export function getGoodsInventoryCountItem(id: string) {
  return http.get<GoodsInventoryCountItemDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增物料盘点详情 */
export function addGoodsInventoryCountItem(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改物料盘点详情 */
export function updateGoodsInventoryCountItem(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除物料盘点详情 */
export function deleteGoodsInventoryCountItem(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出物料盘点详情 */
export function exportGoodsInventoryCountItem(query: GoodsInventoryCountItemQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
