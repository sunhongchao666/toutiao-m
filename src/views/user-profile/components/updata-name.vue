<template>
  <div class="updata-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="编辑昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model="nickName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入新昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updataUserProfile } from '@/api/user'
export default {
  name: 'UpdataName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      nickName: this.value
    }
  },
  created() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        if (!this.nickName.length) {
          this.toast('昵称不能为空！')
          return
        }
        const { data: res } = await updataUserProfile({
          name: this.nickName
        })
        console.log(res)
        // 更新视图
        this.$emit('input', this.nickName)
        // 关闭弹层
        this.$emit('close')
        // 提示更新成功
        this.$toast.success('更新成功！')
      } catch (error) {
        this.$toast.fail('更新失败！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 25px;
}
</style>
