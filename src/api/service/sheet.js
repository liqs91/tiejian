import request from '@/utils/request'

// 查询一人一表列表
export function listSheet(query) {
  return request({
    url: '/api/sheet/list',
    method: 'get',
    params: query
  })
}


// 查询一人一表列表
export function findListSheet(query) {
  return request({
    url: '/api/sheet/findListSheet',
    method: 'get',
    params: query
  })
}

// 查询一人一表详细
export function getSheet(id) {
  return request({
    url: '/api/sheet/' + id,
    method: 'get'
  })
}

// 新增一人一表
export function addSheet(data) {
  return request({
    url: '/api/sheet',
    method: 'post',
    data: data
  })
}

// 修改一人一表
export function updateSheet(data) {
  return request({
    url: '/api/sheet',
    method: 'put',
    data: data
  })
}

// 删除一人一表
export function delSheet(id) {
  return request({
    url: '/api/sheet/' + id,
    method: 'delete'
  })
}


// 一人一表统计
export function sheetCountList(query) {
  return request({
    url: '/api/sheet/sheetCount',
    method: 'get',
    params: query
  })
}
