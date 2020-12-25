<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- 将关注和未关注按钮封装为一个组件 -->
          <!-- 将article.is_followed传递给子组件 -->
          <!-- 当我们传递给子组件的数据既要使用，又要修改 可以通过 v-model 来实现
          传递：自定义属性 props接收
          :followed="article.is_followed"
          修改：通过自定义事件
           @upDataFollow="article.is_followed = $event"
           v-model 的原理：
           :value="article.is_followed"
           @input="article.is_followed = $event"
           -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
          <!-- 这里的 $event 就是子组件中传过来的 !this.followed这个参数 -->
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFllow"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFllow"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon class="comment-icon" name="comment-o" info="123" />
          <!-- 收藏文章按钮组件 -->
          <collent-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- <van-button class="btn-item" icon="star-o" /> -->

          <!-- 点赞组件 -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- <van-button class="btn-item" icon="good-job-o" /> -->
          <van-icon name="share"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticle" class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
// 将获取文章接口导入进来
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
// 将子组件关注用户导入
import FollowUser from '@/components/follow-user'
// 将子组件收藏文章导入
import CollentArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollentArticle,
    LikeArticle
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章列表
      loading: true, // 用来控制加载状态
      errStatus: 0, // 失败的状态码
      followLoading: false
    }
  },
  computed: {},
  created() {
    this.loadArticle()
  },
  methods: {
    // 加载文章列表
    async loadArticle() {
      // 展示 loading 加载状态
      this.loading = true
      try {
        const { data: res } = await getArticleById(this.articleId)

        // 模拟错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('sfkfjsdkfj')
        // }

        this.article = res.data
        // console.log(res)

        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)

        // // 用$nextTick()方法  将下边 this.loading = false提前
        // this.loading = false
        // this.$nextTick(() => {
        //   this.previewImage()
        // })

        // 请求成功，关闭 loading
        this.loading = false
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        // this.loading = false
        this.$toast('获取数据失败')
      }
      // 加载完成 将 loading 关闭
      this.loading = false
    },

    // 图片预览事件
    previewImage() {
      // 获取所有 img 标签
      const articleContents = this.$refs['article-content']
      const imgs = articleContents.querySelectorAll('img')

      // 获取所有 img 地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)

        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            srartPosition: index
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
