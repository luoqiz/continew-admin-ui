import http from '@/utils/http'

const BASE_URL = '/wms/goodsStock'

export interface GoodsStockResp {
  id: string
  stockInId: string
  stockInNo: string
  stockInDetailId: string
  goodsId: string
  goodsSku: string
  initNum: string
  realNum: string
  whseType: number
  whseId: string
  status: string
  prodTime: string
  expiryTime: string
  info: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsStockDetailResp {
  id: string
  stockInId: string
  stockInNo: string
  stockInDetailId: string
  goodsId: string
  goodsSku: string
  initNum: string
  realNum: string
  whseType: string
  whseId: string
  whseAreaId: string
  status: string
  prodTime: string
  expiryTime: string
  info: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsStockQuery {
  stockInId: string | undefined
  stockInNo: string | undefined
  stockInDetailId: string | undefined
  goodsId: string | undefined
  goodsSku: string | undefined
  whseType: string | undefined
  whseId: string | undefined
  status: string | undefined
  prodTime: string | undefined
  expiryTime: string | undefined
  sort: Array<string>
}
export interface GoodsStockPageQuery extends GoodsStockQuery, PageQuery {}

/** @desc 查询商品库存列表 */
export function listGoodsStock(query: GoodsStockPageQuery) {
  return http.get<PageRes<GoodsStockResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询商品库存详情 */
export function getGoodsStock(id: string) {
  return http.get<GoodsStockDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增商品库存 */
export function addGoodsStock(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改商品库存 */
export function updateGoodsStock(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除商品库存 */
export function deleteGoodsStock(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出商品库存 */
export function exportGoodsStock(query: GoodsStockQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}

/** @desc 获取指定库的今日入库信息 */
export function staticsStockInToday(whseId: string) {
  return http.get(`${BASE_URL}/statics/${whseId}`)
}

/** @desc 获取指定库的库存信息 */
export function staticsStock(whseId: string) {
  return http.get(`${BASE_URL}/statics/stock/${whseId}`)
}

/** @desc 统计临时 */
export function staticsExpired(whseId: string, day: number) {
  return http.get(`${BASE_URL}/statics/expired/${whseId}?day=${day}`)
}
