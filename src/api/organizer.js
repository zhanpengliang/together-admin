import request from '@/utils/request'


export function queryOrganizerDetail(data) {
  return request({
    url: 'organizer/detail/query',
    method: 'post',
    data
  })
}
