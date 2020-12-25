<template>
  <div id="app">
    <keep-alive :exclude="['ArticleIndex', 'SearchIndex']">
      <!-- 路由出口 -->
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="less"></style>
