<template>
  <div class="search-container">
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <!-- 搜索栏 -->
    <form action="/">
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
    <search-result v-if="isSearchResult" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <!-- 父组件通过自定义属性将searchText传递下去 -->
    <search-suggestion v-else-if="searchText" :searchText="searchText" />
    <!-- /联想建议 -->

    <!-- 搜索历史 -->
    <search-history v-else />
    <!-- /搜索历史 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import SearchSuggestion from './components/search-suggestion'
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
      isSearchResult: false // 控制搜索结果框
    }
  },
  computed: {},
  created() {},
  methods: {
    onSearch(val) {
      // this.$toast(val)
      this.isSearchResult = true
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
  .van-search__action {
    color: #fff;
  }
}
</style>
