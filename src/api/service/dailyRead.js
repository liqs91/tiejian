import request from '@/utils/request'

// 查询日报已读列表
export function listDailyRead(query) {
  return request({
    url: '/api/dailyRead/list',
    method: 'get',
    params: query
  })
}

// 查询日报已读详细
export function getDailyRead(id) {
  return request({
    url: '/api/dailyRead/' + id,
    method: 'get'
  })
}

// 新增日报已读
export function addDailyRead(data) {
  return request({
    url: '/api/dailyRead',
    method: 'post',
    data: data
  })
}

// 修改日报已读
export function updateDailyRead(data) {
  return request({
    url: '/api/dailyRead',
    method: 'put',
    data: data
  })
}

// 删除日报已读
export function delDailyRead(id) {
  return request({
    url: '/api/dailyRead/' + id,
    method: 'delete'
  })
}
