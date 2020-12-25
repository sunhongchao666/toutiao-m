<template>
  <van-button
    v-if="followed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
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
    :loading="loading"
    @click="onFllow"
    >关注</van-button
  >
</template>

<script>
import { addFollowUser, deleteFollowUser } from '@/api/user'

export default {
  name: 'FollowUser',
  // 如果还想用以前的自定义属性和事件  父组件还用 v-model 来绑定数据
  // 可以通过子组件的 model 属性来进行配置
  model: {
    prop: 'followed', // 默认属性是value
    event: 'upDataFollow' // 默认事件为 input
  },
  props: {
    followed: {
      type: Boolean,
      required: true
    },
    userId: {
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
    // 关注与未关注处理函数
    async onFllow() {
      this.loading = true // 展示关注按钮的loading状态
      try {
        if (this.followed) {
          // 已关注 取消关注
          await deleteFollowUser(this.userId)
          // this.loading = true
        } else {
          // 未关注，添加关注
          await addFollowUser(this.userId)
          // this.loading = true
        }
        // this.article.is_followed = !this.article.is_followed
        // console.log(!this.followed)
        // 更新视图
        this.$emit('upDataFollow', !this.followed)
      } catch (error) {
        let message = '操作失败，请重试！'
        if (error.response && error.response.status === 400) {
          message = '不能关注自己！'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style scoped lang="less"></style>
