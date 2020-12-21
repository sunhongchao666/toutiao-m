// 用户相关请求接口
import request from '@/utils/request'
// import store from '@/store'

// 登录接口
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 验证码请求接口
// 一个手机号一分钟之内只能发送一次验证码
export const getSmsCode = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户频道数据列表接口
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
