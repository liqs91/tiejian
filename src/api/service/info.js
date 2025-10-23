import request from '@/utils/request'

// 查询消息列表
export function listInfo(query) {
  return request({
    url: '/api/info/list',
    method: 'get',
    params: query
  })
}

// 查询消息详细
export function getInfo(id) {
  return request({
    url: '/api/info/' + id,
    method: 'get'
  })
}

// 新增消息
export function addInfo(data) {
  return request({
    url: '/api/info',
    method: 'post',
    data: data
  })
}

// 修改消息
export function updateInfo(data) {
  return request({
    url: '/api/info',
    method: 'put',
    data: data
  })
}

// 删除消息
export function delInfo(id) {
  return request({
    url: '/api/info/' + id,
    method: 'delete'
  })
}
