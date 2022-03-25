<template>
  <div class="channel-edit">
    <!-- 我的频道------------------ -->
    <!-- 头部部分-->
    <van-cell center :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        round
        plain
        size="small"
        class="edit-btn"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? "编辑" : "完成" }}
      </van-button>
    </van-cell>

    <!-- 频道部分 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channels, index) in my_channels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channels, index)"
      >
        <van-icon
          name="clear"
          slot="icon"
          v-show="isEdit && !fixedChannels.includes(channels.id)"
        ></van-icon>
        <span
          slot="text"
          class="text"
          :class="{ active: index === my_active }"
          >{{ channels.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐------------------------- -->
    <!-- 头部部分-->
    <van-cell center :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <!-- 频道部分 -->
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        class="grid-item"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels,
} from "@/api/channels";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  name: "ChannelEdit",
  props: {
    my_channels: {
      type: Array,
      require: true,
    },
    my_active: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      allChannels: [],
      isEdit: false, //控制编辑状态
      fixedChannels: [0], //固定频道，不允许删除
    };
  },
  computed: {
    ...mapState(["user"]),

    //   推荐频道的列表
    recommendChannels() {
      const channels = [];
      this.allChannels.forEach((channel) => {
        //   find遍历数组，找到符合条件的元素项
        const ret = this.my_channels.find((myChannel) => {
          return myChannel.id === channel.id;
        });

        //如果我的频道不包括推荐频道项，则收集到推荐频道项
        if (!ret) {
          channels.push(channel);
        }
      });

      //把计算属性结果返回
      return channels;
    },
  },
  methods: {
    //   加载所有频道列表方法
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        this.allChannels = data.data.channels;
      } catch (err) {
        this.$toast("获取数据失败!");
      }
    },

    //点击推荐频道加载到我的频道事件
    async onAddChannel(channel) {
      //   计算属性会自动删除推荐里面的频道
      this.my_channels.push(channel);

      //  数据持久化
      if (this.user) {
        try {
          //登录状态 把数据存储到接口上
          await addUserChannels({
            id: channel.id, //频道id
            seq: this.my_channels.length, //序号
          });
        } catch (err) {
          this.$toast("保存失败，请稍后重试");
        }
      } else {
        //非登录状态 把数据存储到本地
        setItem("TOUTIAO_CHANNELS", this.my_channels);
      }
    },

    //宫格点击事件
    onMyChannelClick(channels, index) {
      if (this.isEdit) {
        // 固定频道不能删除
        if (this.fixedChannels.includes(index)) {
          return;
        }

        //编辑状态 true
        // 1.删除宫格
        this.my_channels.splice(index, 1);

        //如果删除的是激活宫格前面的项目
        // 让激活频道索引减1;
        if (index <= this.active) {
          this.$emit("Update-Active", this.active - 1);
        }

        // 数据持久化
        this.deleteChannel(channels.id);
      } else {
        //非编辑状态 false
        this.$emit("Update-Active", index, false);
      }
    },

    //删除频道方法(在宫格点击事件里面调用)
    async deleteChannel(channelId) {
      if (this.user) {
        //  登录状态 请求接口
        try {
          await deleteUserChannels(channelId);
        } catch (err) {
          this.$toast("操作失败，请稍后尝试");
        }
      } else {
        //  未登录状态 删除本地
        // 与存储到本地方法一样，直接覆盖掉(即重新存储一遍)
        setItem("TOUTIAO_CHANNELS", this.my_channels);
      }
    },
  },
  created() {
    //   获取所有频道列表
    this.loadAllChannels();
  },
};
</script>


<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;

  //   头部部分
  .title-text {
    font-size: 32px;
    color: #333;
  }

  //   编辑按钮
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  //    宫格部分
  /deep/.grid-item {
    width: 160px;
    height: 86px;

    .van-grid-item__content {
      white-space: nowrap; //文字多的时候不要折行
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }

      //被选中的宫格的样式
      .active {
        color: red;
      }
    }
  }

  // 推荐宫格
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;

        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }

  //我的宫格
  /deep/.my-grid {
    .grid-item {
      .van-grid-item__content {
        .van-icon-clear {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 30px;
          color: #cacaca;
          z-index: 2;
        }
      }
    }
  }
}
</style>