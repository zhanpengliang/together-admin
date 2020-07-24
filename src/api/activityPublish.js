import request from '@/utils/request'


export function publishActivity(data) {
  return request({
    url: 'activity/organizer/publishActivity',
    method: 'post',
    data
  })
}
