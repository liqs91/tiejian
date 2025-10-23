import request from '@/utils/request'

// 查询日程列表
export function listSchedule(query) {
  return request({
    url: '/api/schedule/list',
    method: 'get',
    params: query
  })
}

export function getScheduleData(query) {
  return request({
    url: '/api/schedule/scheduleData',
    method: 'get',
    params: query
  })
}

// 查询日程详细
export function getSchedule(id) {
  return request({
    url: '/api/schedule/' + id,
    method: 'get'
  })
}

// 新增日程
export function addSchedule(data) {
  return request({
    url: '/api/schedule',
    method: 'post',
    data: data
  })
}

// 修改日程
export function updateSchedule(data) {
  return request({
    url: '/api/schedule',
    method: 'put',
    data: data
  })
}

// 删除日程
export function delSchedule(id) {
  return request({
    url: '/api/schedule/' + id,
    method: 'delete'
  })
}
