<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 频道列表 -->
    <!--
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过 animated 属性可以开启切换标签内容时的转场动画
      通过 swipeable 属性可以开启滑动切换标签页
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 组件传值————自定义属性 -->
        <article-list :item="item" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="channeleEdit = true">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道列表 -->

    <!-- 频道列表弹出层 -->
    <van-popup
      v-model="channeleEdit"
      position="bottom"
      closeable
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        @updae-active="onUpdateActive"
        :my-pindao="channels"
        :active="active"
      />
    </van-popup>
  </div>
</template>

<script>
// 1、导入获取用户频道列表数据接口的方法
import { getUserChannels } from '@/api/user'
// 将子组件导入进来
import articleList from './components/article-list'
import channelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    articleList: articleList,
    channelEdit: channelEdit
  },
  data() {
    return {
      active: 0,
      // 4、定义频道数据列表
      channels: [],
      channeleEdit: false // 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 3、调用获取频道列表方法
    this.loadChannels()
  },
  mounted() {},
  methods: {
    // 2、定义加载获取数据列表的方法
    async loadChannels() {
      try {
        // const { data: res } = await getUserChannels()
        // console.log(res)
        // this.channels = res.data.channels
        let channels = []

        // 如果已登录 ，请求获取用户频道列表
        if (this.user) {
          const { data: res } = await getUserChannels()
          channels = res.data.channels
        } else {
          // 未登录，判断是否有本地存储的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有本地存储 请求获取默认频道列表
            const { data: res } = await getUserChannels()
            channels = res.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取用户频道列表失败！')
      }
    },
    // 通过$emit监听父亲的自定义事件 将儿子的index传到onUpdateActive里面
    onUpdateActive(i, channeleEdit) {
      this.active = i
      // 将值传过来之后，将弹框关掉
      this.channeleEdit = channeleEdit
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-bottom: 100px;
  padding-top: 174px;
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 36px;
    }
  }
  // 样式穿透
  /deep/.van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      width: 100%;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .van-tabs__nav {
      padding: 0;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
  }
}
</style>
