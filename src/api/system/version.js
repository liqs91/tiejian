import request from '@/utils/request'


export function listVersion(query) {
  return request({
    url: '/system/version/list',
    method: 'get',
    params: query,
  })
}


export function getVersion(id) {
  return request({
    url: '/system/version/' + id,
    method: 'get',
  })
}


export function addVersion(data) {
   return request({
    url: '/system/version',
    method: 'post',
    data: data,
  })
}


export function updateVersion(data) {
   return request({
    url: '/system/version/edit',
    method: 'post',
    data: data,
  })
}


export function delVersion(id) {
  return request({
    url: '/system/version/' + id,
    method: 'delete',
  })
}


