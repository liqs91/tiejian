import request from '@/utils/request'

// 查询日报点赞列表
export function listDailyClick(query) {
  return request({
    url: '/api/dailyClick/list',
    method: 'get',
    params: query
  })
}

// 查询日报点赞详细
export function getDailyClick(id) {
  return request({
    url: '/api/dailyClick/' + id,
    method: 'get'
  })
}

// 新增日报点赞
export function addDailyClick(data) {
  return request({
    url: '/api/dailyClick',
    method: 'post',
    data: data
  })
}

// 修改日报点赞
export function updateDailyClick(data) {
  return request({
    url: '/api/dailyClick',
    method: 'put',
    data: data
  })
}

// 删除日报点赞
export function delDailyClick(id) {
  return request({
    url: '/api/dailyClick/' + id,
    method: 'delete'
  })
}
