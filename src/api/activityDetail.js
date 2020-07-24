import request from '@/utils/request'

export function  queryActivityDetail(data) {
  return request({
    url: 'activity/organizer/queryActivity',
    method: 'post',
    data
  })
}
