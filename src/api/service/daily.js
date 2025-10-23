import request from '@/utils/request'

// 查询日报列表
export function listDaily(query) {
  return request({
    url: '/api/daily/list',
    method: 'get',
    params: query
  })
}

// 查询日报详细
export function getDaily(id) {
  return request({
    url: '/api/daily/' + id,
    method: 'get'
  })
}

// 新增日报
export function addDaily(data) {
  return request({
    url: '/api/daily',
    method: 'post',
    data: data
  })
}

// 修改日报
export function updateDaily(data) {
  return request({
    url: '/api/daily',
    method: 'put',
    data: data
  })
}

// 删除日报
export function delDaily(id) {
  return request({
    url: '/api/daily/' + id,
    method: 'delete'
  })
}
