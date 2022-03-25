<template>
  <van-button
    class="follow-btn"
    round
    size="small"
    v-if="isFollow"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    v-else
    @click="onFollow"
    :loading="loading"
    >关注</van-button
  >
</template>

<script>
import { addFlow, deleteFlow } from "@/api/user";
export default {
  name: "FollowIndex",
  props: {
    isFollow: {
      type: Boolean,
      require: true,
    },
    userId: {
      type: [String, Number, Object],
      require: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    //关注点击事件
    async onFollow() {
      this.loading = true; //一开始展示loading状态

      try {
        if (this.isFollow) {
          //已关注,取消关注
          await deleteFlow(this.userId);
        } else {
          //未关注，添加关注
          await addFlow(this.userId);
        }

        // 更新视图
        // 要去父组件更改
        this.$emit("updata-is_followed", !this.isFollow);
      } catch (err) {
        let message = "操作失败,请重试";
        if (err.response && err.response.status === 400) {
          message = "你不能关注你自己";
        }
        this.$toast(message);
        console.log(err);
      }

      // 不管获取数据失败还是成功，关闭loading
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
</style>