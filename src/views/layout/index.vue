<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view></router-view>

    <!-- 标签导航栏 -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item replace to="/">
        <i slot="icon" class="iconfont icon-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/qa">
        <i slot="icon" class="iconfont icon-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/video">
        <i slot="icon" class="iconfont icon-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/my">
        <i slot="icon" class="iconfont icon-wode"></i>
        <span class="text">{{ $store.state.user ? "我的" : "未登录" }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "LayoutIndex",
  data() {
    return {};
  },
};
</script>

<style lang='less' scoped>
.layout-container {
  .layout-tabbar {
    // 小图标样式
    i.iconfont {
      font-size: 40px;
    }
    // 导航栏文字的样式
    span.text {
      font-size: 20px;
    }
  }
}
</style>