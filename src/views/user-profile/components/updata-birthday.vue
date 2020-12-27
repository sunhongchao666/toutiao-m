<template>
  <div class="updata-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updataUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdataBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
      birthday: this.value
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        const { data: res } = await updataUserProfile({
          birthday: currentDate
        })
        console.log(res)
        // 更新视图
        this.$emit('input', currentDate)
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

<style scoped lang="less"></style>
