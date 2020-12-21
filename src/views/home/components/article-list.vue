<template>
  <div class="article-list">
    <!-- List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="successInfo"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- 将文章各个组件放到文章列表中 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 将获取文章列表的数据接口导入进来
import { getArticleList } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'articleList',
  components: { ArticleItem },
  // 子组件通过 props来接收
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false,
      finished: false,
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isRefreshLoading: false, // 控制下拉刷新的状态
      successInfo: '刷新成功'
    }
  },
  created() {},
  methods: {
    // 页面加载的时候触发
    async onLoad() {
      try {
        // 请求获取数据
        const { data: res } = await getArticleList({
          channel_id: this.item.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        console.log(res)

        // 数据太少 为了展示效果强行制造一个错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdasafsa')
        // }

        // 将数据存到 list 数组中
        const { results } = res.data
        this.list.push(...results)

        // // 页面加载完成后 将 loading 改为 false 方便下次加载触发
        this.loading = false
        console.log(results.length)
        // // 判断数据是否加载完成
        if (this.list.length >= results.length) {
          this.finished = true
          // 更新下一页时间戳 （pre_timestamp下一页时间戳）
          this.timestamp = res.data.pre_timestamp
        } else {
          // 没有数据后，将加载状态设置结束
        }
      } catch (error) {
        console.log(error)
        this.loading = false // 关闭loading效果
        this.error = true // 开启错误提示
      }
    },

    // 下拉刷新时触发该函数
    async onRefresh() {
      try {
        // 请求获取数据
        const { data: res } = await getArticleList({
          channel_id: this.item.id,
          timestamp: Date.now(), // 下拉刷新每次请求获取最新数据，所以传时间戳
          with_top: 1
        })
        console.log(res)

        //  为了展示效果强行制造一个错误
        // if (Math.random() > 0.3) {
        //   JSON.parse('sdasafsa')
        // }

        // 将数据存到 list 数组中
        const { results } = res.data
        this.list.unshift(...results)

        // // 页面加载完成后 将 loading 改为 false
        this.isRefreshLoading = false

        this.successInfo = `刷新成功，更行了${results.length}条数据`
      } catch (error) {
        console.log(error)
        this.successInfo = '刷新失败！'
        this.isRefreshLoading = false // 关闭loading效果
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
