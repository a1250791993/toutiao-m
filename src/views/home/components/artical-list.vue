<template>
  <div class="artical-list">
    <van-pull-refresh
      v-model="isReFresh"
      @refresh="onRefresh"
      :success-text="successText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <ArticalItem
          v-for="(item, index) in list"
          :key="index"
          :artical="item"
        ></ArticalItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticalList } from "@/api/artical";
// 文章内容组件
import ArticalItem from "@/components/artical-item";
export default {
  name: "ArtList",
  components: {
    ArticalItem,
  },
  props: {
    channel: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false, // 控制列表数据的数组
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页的的时间戳(也就是历史时间戳，最近数据时间戳是Date.now())
      error: false, // 控制列表加载失败的状态
      isReFresh: false, //表示下拉加载状态，false表示加载完成
      successText: "刷新成功",
    };
  },
  methods: {
    // 初始化或滚动到底部会触发调用onload
    async onLoad() {
      try {
        //   1.获取数据
        const { data } = await getArticalList({
          //频道ID
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(), //如果没有数据就获取当前时间戳
        });

        //2.把数据放到List数组
        const { results } = data.data;
        this.list.push(...results);

        // 3.本次数据加载完成之后，把加载状态设置为false
        this.loading = false;

        // 4.判断数据是否加载完
        if (results.length) {
          //获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        // 加载失败停止更新数据
        this.loading = false;
      }
    },

    //下来刷新的时候会触发该函数 接口与获取文章列表一样
    async onRefresh() {
      try {
        // 请求获取数据
        const { data } = await getArticalList({
          //频道ID
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新都是获取最新数据
        });

        // 将数据追加载到列表顶部
        const { results } = data.data;
        this.list.unshift(...results);

        // 将下拉状态设置为false
        this.isReFresh = false;

        // 刷新成功提示文本
        this.successText = `刷新成功,加载了${results.length}条数据`;
      } catch (err) {
        // loading状态结束才会显示文本
        this.isReFresh = false;
        // 刷新失败提示文本
        this.successText = "刷新失败";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.artical-list {
  height: 79vh;
  overflow-y: auto;
}
</style>