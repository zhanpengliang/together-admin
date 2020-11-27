import request from '@/utils/request'


export function queryCredential(data) {
  return request({
    url: 'cos',
    method: 'get'
  })
}
