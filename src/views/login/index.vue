<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登陆">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 导航栏 -->
    <!-- 登陆表单 -->
    <!--
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://vant-contrib.gitee.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
     -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="countDownTime"
            slot="button"
            :time="1000 * 50"
            format="ss s"
            @finish="countDownTime = false"
          />
          <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，
              如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button，
              否则会触发表单提交。  -->
          <van-button
            v-else
            slot="button"
            class="send-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登陆
        </van-button>
      </div>
    </van-form>
    <!-- 登陆表单 -->
  </div>
</template>

<script>
// 导入相关请求数据接口
import { login, getSmsCode } from '@/api/user'

export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '13911111115',
        code: '246810'
      },
      // 配置表单验证规则
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空!'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误！'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空!'
          },
          {
            pattern: /\d{6}/,
            message: '验证码格式错误'
          }
        ]
      },
      // 倒计时
      countDownTime: false
    }
  },
  created() {},
  methods: {
    async onSubmit() {
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 在组件中可以直接通过 this.$toast 调用
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // forbidClick 属性可以禁用背景点击
        duration: 0 // 表示持续时间  如果为0 表示持续展示不停止
      })
      // 提交表单请求登陆
      try {
        const { data: res } = await login(user)
        console.log(res)
        // 组件中用到vuex的mutations 中的setUser函数
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')
        // 登陆成功后，返回到来的页面
        this.$router.back()
      } catch (err) {
        console.dir(err)
        if (err.response && err.response.status === 400) {
          // console.log('手机号或验证码错误！')
          this.$toast.fail('登录失败，手机号或验证码错误')
        } else {
          // console.log('登陆失败，请稍后重试！', err)
          this.$toast.fail('登陆失败，请稍后重试！')
        }
      }
    },
    // 点击发送验证码按钮触发该方法
    async onSendSms() {
      console.log(111)
      // 1、验证手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2、校验通过  显示倒计时
      this.countDownTime = true
      // 3、请求发送验证码
      try {
        // 请求发送验证码的封装方法
        await getSmsCode(this.user.mobile)
        this.$toast.success('发送成功！')
      } catch (err) {
        // 发送失败关闭倒计时
        this.countDownTime = false
        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁，请稍后再发送！')
        } else {
          this.$toast.fail('发送失败，请稍后在发送！')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
    padding-right: 2px;
  }
  .send-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    padding: 0;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      border-radius: 10px;
    }
  }
}
</style>
