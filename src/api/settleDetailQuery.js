import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: 'order/organizer/query',
    method: 'post',
    data
  })
}
