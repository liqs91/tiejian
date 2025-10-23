import request from '@/utils/request'
// 获取路由
export function getRouterList(params) {
  return request({
    url: 'getRouters',
    method: 'get',
    params,
  })
}


