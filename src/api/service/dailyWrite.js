import request from '@/utils/request'

// 查询日报评价列表
export function listDailyWrite(query) {
  return request({
    url: '/api/dailyWrite/list',
    method: 'get',
    params: query
  })
}

// 查询日报评价详细
export function getDailyWrite(id) {
  return request({
    url: '/api/dailyWrite/' + id,
    method: 'get'
  })
}

// 新增日报评价
export function addDailyWrite(data) {
  return request({
    url: '/api/dailyWrite',
    method: 'post',
    data: data
  })
}

// 修改日报评价
export function updateDailyWrite(data) {
  return request({
    url: '/api/dailyWrite',
    method: 'put',
    data: data
  })
}

// 删除日报评价
export function delDailyWrite(id) {
  return request({
    url: '/api/dailyWrite/' + id,
    method: 'delete'
  })
}
