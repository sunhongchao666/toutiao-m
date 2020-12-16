// 封装 axios 请求模块
import axios from 'axios'
import store from '@/store/index'

const request = axios.create({
  // 接口的基准路径
  // baseURL: 'http://ttapi.research.itcast.cn/'
  // 备用接口
  baseURL: 'http://api-toutiao-web.itheima.net/'
})

// 请求拦截器   这里会在登陆时拦截token
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // 请求发起会经过这里
    // config: 本次请求的配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
  },
  function(error) {
    // 如果请求出错了 （还没有发出去） 会进入到这里
    return Promise.reject(error)
  }
)

// 响应拦截器
// // Add a response interceptor
// request.interceptors.response.use(
//   function(response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response
//   },
//   function(error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error)
//   }
// )

export default request
