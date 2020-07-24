import request from '@/utils/request'


export function addActivity(data) {
  return request({
    url: 'activity/organizer/insertActivity',
    method: 'post',
    data
  })
}
