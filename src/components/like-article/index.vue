<template>
  <van-icon
    :class="{
      active: value === 1,
    }"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addLike, deleteLike } from "@/api/artical";
export default {
  props: {
    value: {
      type: Number,
      require: true,
    },

    artId: {
      type: [Number, Object, String],
      require: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onCollect() {
      this.loading = true;

      try {
        let status = -1; //点赞的状态
        if (this.value === 1) {
          // 已点赞 要取消收藏
          await deleteLike(this.artId);
        } else {
          // 未点赞 要点击收藏
          await addLike(this.artId);
          status = 1;
        }

        //   更新视图
        this.$emit("input", status);

        // 因为更新视图时候传出去的值，不是立马收到的，所以和更新视图一样取反就可以了
        this.$toast.success(status === 1 ? "点赞成功" : "取消点赞");
      } catch (err) {
        this.$toast.fail("操作失败,请重试");
        console.log(err);
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.active {
  color: #e5645f;
}
</style>