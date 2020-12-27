<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    @load="onLoad"
    :immediate-check="false"
  >
    <!-- immediate-check这是解决评论回复重复的问题 一上来不加载methods里面的onLoad -->
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getArticleComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 给type增加验证
      // 自定义 Prop 数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a' // 默认值
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 20,
      error: false
    }
  },
  created() {
    // 手动初始化 onLoad时，不会自动开启初始的 loading
    // 必须手动修改
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        //    type
        //      a 文章的评论
        //      c 评论的回复
        //    source
        //      文章的评论，则传递文章的 ID
        //      评论的回复，则传递评论的 ID
        // 1、请求获取数据
        const { data: res } = await getArticleComments({
          type: this.type, // 评论类型 a 表示评论 c 表示对评论的回复
          source: this.source.toString(), // 文章 id  这里将文章id强行转换为字符串，防止参数有误
          offset: this.offset, // 获取文章评论数据的偏移量，值为评论id，表示从此id数据向后取，不传表示第一页开始读取数据
          limit: this.limit // 表示每页文章评论显示最大条数
        })

        // 2、将数据存到list数组中
        console.log(res)
        const { results } = res.data
        this.list.push(...results)

        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', res.data)

        // 3、将 loading 设置为false
        this.loading = false

        // 4、判断是否还有数据
        if (results.length) {
          //    有就更新获取下一页数据页码
          this.offset = res.data.last_id
        } else {
          //    没有就将 finished 设置结束
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
        // this.$toast('获取数据失败！')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
