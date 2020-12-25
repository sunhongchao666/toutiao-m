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

/**
 * 获取文章列表接口
 */
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const addCollectArticle = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: { target }
  })
}

// 取消收藏文章
export const deleteCollectArticle = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

// 点赞文章
export const likeArticle = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: { target }
  })
}

// 取消点赞
export const dislikeArticle = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
