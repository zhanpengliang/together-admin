import request from '@/utils/request'

export function getActivityList(data) {
  return request({
    url: 'activity/organizer/queryActivityList',
    method: 'post',
    data
  })
}
