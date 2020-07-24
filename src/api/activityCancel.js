import request from '@/utils/request'


export function cancelActivity(data) {
  return request({
    url: 'activity/organizer/cancelActivity',
    method: 'post',
    data
  })
}
