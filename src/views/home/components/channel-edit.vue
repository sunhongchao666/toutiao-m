<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        size="mini"
        round
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- grid宫格 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in myPindao"
        :key="index"
        @click="onMyChannelBtn(item, index)"
      >
        <!-- 动态控制图标 用van-icon标签 并且用slot插槽的icon来实现 -->
        <van-icon
          v-show="isEdit && !fixedChannels.includes(item.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- v-bind:class语法：里面是一个对象，键表示要做用的css类名，值表示要计算出的布尔值
        true，则作用该类名 false不作用该类名 -->
        <span class="text" :class="{ active: index === active }" slot="text">{{
          item.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道列表 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道列表</div>
    </van-cell>
    <!-- grid宫格 -->
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(items, i) in recommendChannels"
        :key="i"
        icon="plus"
        :text="items.name"
        @click="addChannels(items)"
      />
    </van-grid>
  </div>
</template>

<script>
// 引入请求所有频道列表的封装方法
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myPindao: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      Allchannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fixedChannels: [0] // 固定频道 不允许删除
    }
  },
  // 全部频道 - 我的频道 = 频道推荐 即Allchannels - channels = tuijianChannels
  computed: {
    recommendChannels() {
      const tuijianChannels = []
      this.Allchannels.forEach(channel => {
        // console.log(this)
        // find 遍历数组，找到满足条件的元素项
        const result = this.myPindao.find(function(myPindao) {
          return myPindao.id === channel.id
        })
        // console.log(result)
        // // 如果我的频道中不包含该频道项，则push到推荐频道中
        if (!result) {
          tuijianChannels.push(channel)
        }
      })
      // console.log(tuijianChannels)
      // 将推荐频道return出去
      return tuijianChannels
    },
    // 将store里面的 user 映射进来
    ...mapState(['user'])
  },
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    // 获取所有频道数据
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannels()
        // console.log(res)
        this.Allchannels = res.data.channels
      } catch (error) {
        this.$toast('获取频道列表失败！')
      }
    },

    // 添加频道函数
    async addChannels(items) {
      this.myPindao.push(items)
      // 数据持久化
      // 如果登录了，将用户频道展示出来
      // 已登录，将数据存储于后台服务器
      if (this.user) {
        try {
          await addUserChannels({
            id: items.id,
            // seq 顺序序号（就是我的频道的数组长度）
            seq: this.myPindao.length
          })
          this.$toast('添加频道成功！')
        } catch (error) {
          this.$toast('获取频道失败！')
        }
      } else {
        // 未登录，将数据存储在本地
        setItem('TOUTIAO_CHANNELS', this.myPindao)
      }
    },

    // 点击我的频道每个块区域，触发该函数
    onMyChannelBtn(item, index) {
      // 如果 isEdit 为 true 编辑状态 进行删除操作
      if (this.isEdit) {
        // 如果是固定频道，不允许删除
        if (this.fixedChannels.includes(item.id)) {
          return
        }
        // 如果我的频道里的索引 <= 高亮的频道active（删除高亮之前的频道），删除时让高亮的频道的active-1
        if (index <= this.active) {
          this.$emit('updae-active', this.active - 1, true)
        }
        this.myPindao.splice(index, 1)

        // 删除数据持久化
        this.deleteChannel(item)
      } else {
        // 如果isEdit为false 非编辑状态 执行切换频道
        this.$emit('updae-active', index, false)
      }
      // console.log(111)
    },

    // 删除用户指定频道的数据方法
    async deleteChannel(item) {
      try {
        if (this.user) {
          // 已登录，将删除后的数据存在服务器上
          await deleteUserChannel(item.id)
        } else {
          // 未登录 将数据存储在本地存储中
          setItem('TOUTIAO_CHANNELS', this.myPindao)
        }
      } catch (error) {
        this.$toast('删除失败！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 3;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
