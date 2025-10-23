import request from '@/utils/request'

// 查询任务动态列表
export function listTaskLog(query) {
  return request({
    url: '/api/taskLog/list',
    method: 'get',
    params: query
  })
}

// 查询任务动态详细
export function getTaskLog(id) {
  return request({
    url: '/api/taskLog/' + id,
    method: 'get'
  })
}

// 新增任务动态
export function addTaskLog(data) {
  return request({
    url: '/api/taskLog',
    method: 'post',
    data: data
  })
}

// 修改任务动态
export function updateTaskLog(data) {
  return request({
    url: '/api/taskLog',
    method: 'put',
    data: data
  })
}

// 删除任务动态
export function delTaskLog(id) {
  return request({
    url: '/api/taskLog/' + id,
    method: 'delete'
  })
}
