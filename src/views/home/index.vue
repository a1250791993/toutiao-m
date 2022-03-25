<template>
  <div class="home-container">
    <!-- 头部搜索导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        type="info"
        slot="title"
        size="small"
        round
        icon="search"
        class="search-btn"
        to="/search"
      >
        搜索按钮
      </van-button>
    </van-nav-bar>

    <!-- 文章列表 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <!-- 标签导航 -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章内容 -->
        <artical-list :channel="channel"></artical-list>
      </van-tab>
      <!-- 占位盒子 防止汉堡按钮榜内容挡住 -->
      <div class="placeholder" slot="nav-right"></div>
      <div class="hamburger-btn" slot="nav-right" @click="isChannelShow = true">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>

    <!-- (汉堡按钮)频道列表弹出层 -->
    <van-popup
      v-model="isChannelShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my_channels="channels"
        :my_active="active"
        @Update-Active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getChannels } from "@/api/user";
import ArticalList from "./components/artical-list.vue";
import ChannelEdit from "./components/channel-edit.vue";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  name: "HomeIndex",
  components: {
    ArticalList,
    ChannelEdit,
  },
  data() {
    return {
      active: 0,
      channels: [],
      isChannelShow: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    //获取用户频道列表发放
    async loadChannels() {
      try {
        // 定义一个转折变量 不要直接赋值对象
        let channels = [];

        if (this.user) {
          // 登录状态
          const { data } = await getChannels();
          channels = data.data.channels;
        } else {
          // 未登录状态
          const localChannels = getItem("TOUTIAO_CHANNELS");
          if (localChannels) {
            // 有就拿来
            channels = localChannels;
          } else {
            // 没有就默认频道列表
            const { data } = await getChannels();
            channels = data.data.channels;
          }
        }

        this.channels = channels;
      } catch (err) {
        this.$toast("获取用户频道列表失败");
      }
    },

    //更新Active
    //isChannelShow = true 默认值，不传参就是默认值
    onUpdateActive(index, isChannelShow = true) {
      this.active = index;

      // 关闭弹出层
      this.isChannelShow = isChannelShow;
    },
  },

  created() {
    // 调用方法获取频道列表数据;
    this.loadChannels();
  },
};
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;

  // 搜索框的样式----------------------------------
  // 去除搜索框被父亲盒子受的限制
  // 在子组件中 一个单独作用域 scoped 的样式中， 只能作用到组件的根节点中 根节点的后代是作用不到的 要使用 /deep/ >>> 谁不报错用谁
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    font-size: 28px;
    border: none;
  }
  .van-icon-search {
    font-size: 32px;
  }

  // 文章列表样式----------------------------------
  // 标签导航
  /deep/.channel-tabs {
    .van-tabs__wrap {
      // 固定定位
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }

    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }

    // 被选中的标签样式
    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;

      .van-tabs__line {
        bottom: 8px;
        background-color: #3296fa;
        width: 31px;
        height: 6px;
      }
    }

    //汉堡按钮样式
    .hamburger-btn {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 0;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont {
        font-size: 33px;
      }

      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url("@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }

    // 占位盒子
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0; // 1表示参与flex的分布布局 0表示不参与
    }
  }
}
</style>