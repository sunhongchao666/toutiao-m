// 文章请求模块
import request from '@/utils/request'

// 获取新闻列表推荐数据接口
export const getArticleList = params => {
  return request({
    method: 'GET',
    url: '/v1_1/articles',
    params: params
  })
}
