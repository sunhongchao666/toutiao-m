<template>
  <div class="search-container">
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <!-- 搜索栏 -->
    <form class="search-from" action="/">
      <!-- 当触发搜索的时候，可以触发search事件，点击取消的时候可以触发cancel事件 -->
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isSearchResult = false"
      />
    </form>
    <!-- /搜索栏  -->

    <!-- 搜索结果 -->
    <!-- 将搜索结果通过自定义属性传递给searchResult子组件 -->
    <search-result v-if="isSearchResult" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <!-- 父组件通过自定义属性将searchText传递下去 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />
    <!-- 子传父通过自定义search事件 -->
    <!-- /联想建议 -->

    <!-- 搜索历史 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    />
    <!-- /搜索历史 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import SearchSuggestion from './components/search-suggestion'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  props: {},
  data() {
    return {
      searchText: '', // 控制联想建议框
      isSearchResult: false, // 控制搜索结果框
      searchHistories: getItem('TOUTIAO_SEARCH_HOSTORIES') || [] // 搜索历史记录数据
    }
  },
  computed: {},
  watch: {
    searchHistories: {
      handler(value) {
        setItem('TOUTIAO_SEARCH_HOSTORIES', value)
      }
    }
  },
  created() {},
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史记录
      // 要求：不要有重复历史记录  最新历史记录排在最前边
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      // 展示搜索结果
      this.isSearchResult = true

      // console.log(this.searchText)
    },
    onCancel() {
      this.$router.back()
      this.$toast('取消')
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
