// 获取所有频道接口
import request from '@/utils/request'

// 获取所有频道列表请求
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 添加用户频道接口
export const addUserChannels = channel => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// 删除用户指定频道接口
export const deleteUserChannel = itemid => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${itemid}`
  })
}
