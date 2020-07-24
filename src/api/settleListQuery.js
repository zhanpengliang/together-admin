import request from '@/utils/request'

export function getSettleList(data) {
  return request({
    url: 'settle/queryList',
    method: 'post',
    data
  })
}
