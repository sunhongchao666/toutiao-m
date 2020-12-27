<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell title="头像" is-link
      ><van-image class="avatar" round fit="cover" :src="user.photo"
    /></van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isUpdataNameShow = true"
    />
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 1 ? '女' : '男'"
      @click="isUpdataGenderShow = true"
    />
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isUpdataBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!-- 昵称弹出层 -->
    <van-popup v-model="isUpdataNameShow" style="height: 100%" position="bottom"
      ><updata-name
        v-if="isUpdataNameShow"
        @close="isUpdataNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- /昵称弹出层 -->

    <!-- 性别弹出层 -->
    <van-popup v-model="isUpdataGenderShow" position="bottom"
      ><updata-gender
        v-if="isUpdataGenderShow"
        @close="isUpdataGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- /性别弹出层 -->

    <!-- 生日弹出层 -->
    <van-popup v-model="isUpdataBirthdayShow" position="bottom">
      <updata-birthday
        v-if="isUpdataBirthdayShow"
        @close="isUpdataBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- /生日弹出层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdataName from './components/updata-name'
import UpdataGender from './components/updata-gender'
import UpdataBirthday from './components/updata-birthday'

export default {
  name: 'UserProfile',
  components: {
    UpdataName,
    UpdataGender,
    UpdataBirthday
  },
  props: {},
  data() {
    return {
      user: {}, // 个人信息
      isUpdataNameShow: false,
      isUpdataGenderShow: false,
      isUpdataBirthdayShow: false
    }
  },
  created() {
    this.loadProfile()
  },
  mounted() {},
  methods: {
    async loadProfile() {
      try {
        const { data: res } = await getUserProfile()
        console.log(res)
        this.user = res.data
      } catch (error) {
        this.$taost('获取数据失败！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
