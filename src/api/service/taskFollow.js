import request from '@/utils/request'

// 查询任务跟进列表
export function listFollow(query) {
  return request({
    url: '/api/follow/list',
    method: 'get',
    params: query
  })
}

// 查询任务跟进详细
export function getFollow(id) {
  return request({
    url: '/api/follow/' + id,
    method: 'get'
  })
}

// 新增任务跟进
export function addFollow(data) {
  return request({
    url: '/api/follow',
    method: 'post',
    data: data
  })
}

// 修改任务跟进
export function updateFollow(data) {
  return request({
    url: '/api/follow',
    method: 'put',
    data: data
  })
}

// 删除任务跟进
export function delFollow(id) {
  return request({
    url: '/api/follow/' + id,
    method: 'delete'
  })
}
