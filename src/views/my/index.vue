<template>
  <div class="my-container">
    <!-- 登录成功时候的页面 -->
    <div v-if="user" class="header user-info">
      <!-- 用户信息 -->
      <div class="base-info">
        <div class="left">
          <van-image :src="userInfo.photo" round class="avatar" fit="cover" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button type="default" size="mini" round>编辑资料</van-button>
        </div>
      </div>

      <!-- 用户数据 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 没登录时候的页面 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 -->
    <van-grid column-num="2" class="gird-nav" clickable>
      <van-grid-item class="gird-item">
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="gird-item">
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- 消息通知 -->
    <van-cell title="消息通知" is-link class="info-cell" />
    <van-cell title="小智同学" is-link />
    <van-cell
      v-if="user"
      title="退出登录"
      clickable
      class="out-cell"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
// 请求数据的API方法
import { getUserInfo } from "@/api/user.js";
export default {
  name: "MyIndex",
  data() {
    return {
      userInfo: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    // 退出登录方法
    onLogout() {
      // 在组件中需要用this.$dialog来使用弹框组件
      this.$dialog
        .confirm({
          title: "确认退出",
        })
        .then(() => {
          this.$store.commit("setUser", null);
        })
        .catch(() => {});
    },

    // 请求用户信息方法
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        this.userInfo = data.data;
      } catch (err) {
        this.$toast("获取用户数据失败，请稍后重试");
      }
    },
  },
  created() {
    // 如果用户登录了，请求获取用户信息
    if (this.user) {
      this.loadUserInfo();
    }
  },
};
</script>

<style lang='less' scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }

  // 未登录时候的页面
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;

    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }

      .text {
        font-size: 28px;
      }
    }
  }

  // 登录成功时候的页面
  .user-info {
    background-color: url("~@/assets/banner.png");
    // 用户信息
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        .avatar {
          width: 132px;
          height: 132px;
          border: 4x solid #fff;
        }

        .name {
          font-size: 30px;
          margin-left: 22px;
          color: #fff;
        }
      }
    }

    // 用户数据
    .data-stats {
      height: 130px;
      display: flex;

      .data-item {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

        .count {
          font-size: 36px;
        }

        .text {
          font-size: 23px;
        }
      }
    }
  }

  //宫格导航
  .gird-nav {
    .gird-item {
      height: 141px;

      i.iconfont {
        font-size: 45px;
      }

      .icon-shoucang {
        color: #eb5253;
      }

      .icon-lishi {
        color: #ff9d1d;
      }

      span.text {
        font-size: 28px;
        margin-top: 16px;
      }
    }
  }

  //单元格
  .info-cell {
    margin-top: 9px;
  }

  .out-cell {
    text-align: center;
    color: #d86262;
    margin-top: 9px;
  }
}
</style>