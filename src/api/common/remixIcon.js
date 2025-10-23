import request from '@/utils/request'

export function getIconList(params) {
  return request({
    url: '/remixIcon/getList',
    method: 'get',
    params,
  })
}


export function getSysIconList(params) {
  return request({
    url: '/system/icon/list',
    method: 'get',
    params,
  })
}
