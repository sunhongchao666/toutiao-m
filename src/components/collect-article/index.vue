<template>
  <van-button
    :class="{ collected: value }"
    :icon="value ? 'star' : 'star-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
// 将收藏文章和取消收藏文章加载进来
import { addCollectArticle, deleteCollectArticle } from '@/api/article'

export default {
  name: 'CollentArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  data() {
    return {
      loading: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loadinng = true // 表示文章已收藏
      try {
        if (this.value) {
          await deleteCollectArticle(this.articleId)
        } else {
          await addCollectArticle(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
      } catch (error) {
        this.$toast('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
