<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
// 将获取搜索结果数据列表强求导入进来
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  // 子组件 searchResult 通过props来接收
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  componts: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  computer: {},
  created() {},
  methods: {
    async onLoad() {
      try {
        // 1、请求数据
        const { data: res } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 查询关键字
        })
        console.log(res)
        // 2、将数据添加到数组列表中
        const { results } = res.data
        this.list.push(...results)

        // 3、将本次加载中的 loading 关闭
        this.loading = false

        // 4、判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (error) {
        // 展示加载失败的提示状态
        this.error = true
        // this.$toast('失败')

        // 加载失败 loading也要关闭
        this.loading = true
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
