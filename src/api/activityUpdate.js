import request from '@/utils/request'


export function updateActivityInfo(data) {
  return request({
    url: 'activity/organizer/updateActivity',
    method: 'post',
    data
  })
}
