<template>
  <van-button
    :class="{ liked: value === 1 }"
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
// 将点赞和取消点赞接口加载进来
import { likeArticle, dislikeArticle } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已点赞，取消点赞
          await dislikeArticle(this.articleId)
        } else {
          // 未点赞  添加点赞
          await likeArticle(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.liked {
  .van-icon {
    color: red;
  }
}
</style>
