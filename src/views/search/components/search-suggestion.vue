<template>
  <div class="search-suggestion">
    <!-- 子传父通过$emit触发父组件的自定义search事件 将text传递给父组件 -->
    <van-cell
      icon="search"
      :title="text"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <!-- 关键字高亮 -->
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
// 将联想建议数据请求导入进来
import { getSearchSuggestions } from '@/api/search'

// 将 lodash 包里的 debounce 方法按需加载进来
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  // 联想建议子组件接收父组件index传递过来的searchText
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  componts: {},
  data() {
    return {
      suggestions: [], // 联想建议数据列表
      htmlStr: ''
    }
  },
  computer: {},
  // 在侦听器中监听 searchText 的文本变化，一旦变化就会触发 handler 函数
  watch: {
    searchText: {
      // handler 是固定写法
      // handler(value) {
      //   // console.log(value)
      //   this.loadSearchSuggestions(value)
      // },

      // debounce 方法用来处理防抖
      // 参数1：处理函数
      // 参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function(value) {
        this.loadSearchSuggestions(value)
      }, 300),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created() {},
  methods: {
    // 获取联想建议框数据
    async loadSearchSuggestions(q) {
      try {
        const { data: res } = await getSearchSuggestions(q)
        // console.log(res)
        this.suggestions = res.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },

    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 定义一个正则表达式  将搜索文本框的内容在联想建议中与正则表达式进行匹配  gi代表全部不区分大小写
      const reg = new RegExp(this.searchText, 'gi')
      // 将reg的内容替换为highlightStr
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: hotpink;
  }
}
</style>
