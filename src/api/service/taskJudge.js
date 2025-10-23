import request from '@/utils/request'

// 查询任务评价列表
export function listJudge(query) {
  return request({
    url: '/api/judge/list',
    method: 'get',
    params: query
  })
}

// 查询任务评价详细
export function getJudge(id) {
  return request({
    url: '/api/judge/' + id,
    method: 'get'
  })
}

// 新增任务评价
export function addJudge(data) {
  return request({
    url: '/api/judge',
    method: 'post',
    data: data
  })
}

// 修改任务评价
export function updateJudge(data) {
  return request({
    url: '/api/judge',
    method: 'put',
    data: data
  })
}

// 删除任务评价
export function delJudge(id) {
  return request({
    url: '/api/judge/' + id,
    method: 'delete'
  })
}
