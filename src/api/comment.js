// 获取文章评论和回复模块
import request from '@/utils/request'

// 获取文章评论列表数据接口
export const getArticleComments = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

// 对评论或评论回复点赞请求方法
export const likeComment = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: { target }
  })
}

// 取消对评论或评论回复点赞请求方法
export const dislikeComment = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

// 发布文章评论或评论回复
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
