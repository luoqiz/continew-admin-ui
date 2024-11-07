import http from '@/utils/http'

const BASE_URL = '/wms/goodsSku'

export interface GoodsSkuResp {
  id: string
  barcode: string
  spuId: string
  name: string
  unit: string
  amount: string
  unpacking: string
  packUnit: string
  packAmount: string
  sellPoint: string
  specs: string
  price: string
  img: string
  pics: string
  status: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsSkuDetailResp {
  id: string
  barcode: string
  spuId: string
  name: string
  unit: string
  amount: string
  unpacking: string
  packUnit: string
  packAmount: string
  sellPoint: string
  specs: string
  price: string
  img: string
  pics: string
  status: string
  memo: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface GoodsSkuQuery {
  barcode: string | undefined
  name: string | undefined
  status: string | undefined
  sort: Array<string>
}
export interface GoodsSkuPageQuery extends GoodsSkuQuery, PageQuery {}

/** @desc 查询商品规格(sku)列表 */
export function listGoodsSku(query: GoodsSkuPageQuery) {
  return http.get<PageRes<GoodsSkuResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询商品规格(sku)详情 */
export function getGoodsSku(id: string) {
  return http.get<GoodsSkuDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增商品规格(sku) */
export function addGoodsSku(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改商品规格(sku) */
export function updateGoodsSku(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除商品规格(sku) */
export function deleteGoodsSku(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出商品规格(sku) */
export function exportGoodsSku(query: GoodsSkuQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}
