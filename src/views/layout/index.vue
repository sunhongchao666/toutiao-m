<template>
  <div class="layout-container">
    <!-- 路由缓存 -->
    <keep-alive>
      <!-- 子路由出口 -->
      <router-view />
    </keep-alive>

    <!-- 标签导航栏 -->
    <!-- route:开启路由模式 -->
    <van-tabbar class="layout-tabber" v-model="active" router>
      <van-tabbar-item to="/">
        <i slot="icon" class="iconfont icon-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <i slot="icon" class="iconfont icon-wenda"></i>
        <span class="text">问答</span></van-tabbar-item
      >
      <van-tabbar-item to="/video">
        <i slot="icon" class="iconfont icon-shipin"></i>
        <span class="text">视频</span></van-tabbar-item
      >
      <van-tabbar-item to="/my">
        <i slot="icon" class="iconfont icon-wode"></i>
        <span class="text">{{
          $store.state.user ? '我的' : '未登录'
        }}</span></van-tabbar-item
      >
    </van-tabbar>
    <!-- /标签导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'layoutIndex',
  data() {
    return {
      active: 0
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabber {
    i.iconfont {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
