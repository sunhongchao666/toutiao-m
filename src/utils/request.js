// 封装 axios 请求模块
import axios from 'axios'
import store from '@/store/index'
import router from '@/router'
import jsonBig from 'json-bigint'

// var json = '{ "value" : 9223372036854775807, "v2": 123 }'

// console.log(jsonBig.parse(json))

const request = axios.create({
  // 接口的基准路径 (原路径)
  // baseURL: 'http://ttapi.research.itcast.cn/'
  // 备用接口
  // baseURL: 'http://api-toutiao-web.itheima.net/'
  // 备用接口2   需要去掉/app路径  如:原接口:url: '/app/v1_1/articles'，现在需要删除'/app'：url: '/v1_1/articles'
  baseURL: 'http://toutiao-app.itheima.net/',

  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [
    function(res) {
      try {
        return jsonBig.parse(res)
      } catch (err) {
        return res
      }

      // axios 默认会在内部这样来处理后端返回的数据
      // return JSON.parse(data)
    }
  ]
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

// 响应拦截器 处理token过期问题  将token改为 refresh_token
request.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应的对象
  function(response) {
    return response
  },
  // 响应失败进入第二个函数，该函数的参数是错误对象
  async function(error) {
    // 如果响应是401，请求获取token
    // 响应拦截器中的error 就是响应对象
    if (error.response && error.response.status === 401) {
      // console.dir(error)
      // 校验是否有 refresh_token
      // console.log(store.status)
      // console.log(1111)
      const user = store.state.user
      if (!user || !user.refresh_token) {
        router.push('/login')
        return
      }
      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 如果获取成功，则把新的 token 更新到容器中
        console.log('刷新 token  成功', res)
        store.commit('setUser', {
          token: res.data.data.token, // 最新获取的可用 token
          refresh_token: user.refresh_token // 还是原来的 refresh_token
        })
        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config)
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log('请求刷线 token 失败', err)
        store.commit('setUser', null)
        return router.push('/login')
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default request
