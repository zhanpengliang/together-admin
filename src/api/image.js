import request from '@/utils/request'

export function queryImgAddress(data) {
  return request({
    url: 'image/query',
    method: 'post',
    data
  })
}
