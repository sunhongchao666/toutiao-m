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

    <!-- 图片选择文本 -->
    <input type="file" hidden ref="file" @change="onFileChange" />

    <!-- 个人信息 -->
    <van-cell
      class="photo-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
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

    <!-- 头像弹出层 -->
    <van-popup
      v-model="isUpdataPhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <updata-photo
        v-if="isUpdataPhotoShow"
        :img="img"
        @close="isUpdataPhotoShow = false"
        @updata-photo="user.photo = $event"
      />
    </van-popup>
    <!-- /头像弹出层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdataName from './components/updata-name'
import UpdataGender from './components/updata-gender'
import UpdataBirthday from './components/updata-birthday'
import UpdataPhoto from './components/updata-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdataName,
    UpdataGender,
    UpdataBirthday,
    UpdataPhoto
  },
  props: {},
  data() {
    return {
      user: {}, // 个人信息
      isUpdataNameShow: false,
      isUpdataGenderShow: false,
      isUpdataBirthdayShow: false,
      isUpdataPhotoShow: false,
      img: null
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
    },

    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]

      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      console.log(this.img)

      // 展示图片弹出层
      this.isUpdataPhotoShow = true

      // 如果 file-input 选择了同一个文件不会触发 change 事件
      // 解决：每次使用完毕，把 input 框的 value 清空
      this.$refs.file.value = ''
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
