import request from '@/utils/request'


export function list() {
  return request({
    url: '/chart/list',
    method: 'get',
  })
}



export function taskChart() {
  return request({
    url: '/chart/task',
    method: 'get',
  })
}

export function projectChart() {
  return request({
    url: '/chart/project',
    method: 'get',
  })
}


export function infoChart(query) {
  return request({
    url: '/chart/info',
    method: 'get',
    params: query
  })
}


