<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人中心"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <!-- 个人信息 -->
    <!-- 上传头像的input 让点击头像单元格才触发他的点击 自身隐藏(hidden) -->
    <input type="file" hidden ref="file" @change="onFile" />
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" :src="user.photo" round />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      center
      @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      center
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      center
      @click="isUpdateBirthdayShow = true"
    ></van-cell>

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        v-model="user.name"
        @close="isUpdateNameShow = false"
      ></update-name>
    </van-popup>

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      ></update-gender>
    </van-popup>

    <!-- 编辑生日 -->
    <van-popup position="bottom" v-model="isUpdateBirthdayShow">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"
      ></update-birthday>
    </van-popup>

    <!--编辑头像 -->
    <van-popup
      position="bottom"
      v-model="isUpdatePhotoShow"
      style="height: 100%"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        @close="isUpdatePhotoShow = false"
        :img="img"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo.vue";
export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  data() {
    return {
      user: {}, //用户的个人信息
      isUpdateNameShow: false, //编辑昵称的弹出层显示状态
      isUpdateGenderShow: false, //编辑性别的弹出层显示状态
      isUpdateBirthdayShow: false, //编辑性别的弹出层显示状态
      isUpdatePhotoShow: false, //编辑性别的弹出层显示状态
      img: null, //预览的图片
    };
  },
  methods: {
    // 获取登录用户信息的方法
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        this.user = data.data;
      } catch (err) {
        this.$toast.fail("获取用户数据失败! 请重试");
      }
    },

    // 上传头像的点击方法
    onFile() {
      // 获取文件的操作对象
      const file = this.$refs.file.files[0];

      //基于文章对象获取 blob 数据
      // 获取图片的url
      // const data = window.URL.createObjectURL(file);
      // console.log(data);
      this.img = window.URL.createObjectURL(file);

      // 选择完图片后打开弹出层
      this.isUpdatePhotoShow = true;

      // file-input 如果选了同一个文件，不会触发change事件
      // 解决方法就是每次使用完毕，把他的value清空
      this.$refs.file.value = "";
    },
  },
  created() {
    // 调用获取登录用户信息的方法
    this.loadUserProfile();
  },
};
</script>

<style lang="less" scoped>
// 给头像设置大小
.avatar {
  width: 60px;
  height: 60px;
}

//给弹层设置背景色
.van-popup {
  background-color: #f5f7f9;
}
</style>