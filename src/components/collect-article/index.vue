<template>
  <van-icon
    :color="value ? '#ffa500' : ''"
    :name="value ? 'star' : 'star-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { collectArticle, deleteArticle } from "@/api/artical";
export default {
  props: {
    value: {
      type: Boolean,
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
        if (this.value) {
          // 已收藏 要取消收藏
          await deleteArticle(this.artId);
        } else {
          // 未收藏 要点击收藏
          await collectArticle(this.artId);
        }

        //   更新视图
        this.$emit("input", !this.value);

        // 因为更新视图时候传出去的值，不是立马收到的，所以和更新视图一样取反就可以了
        this.$toast.success(!this.value ? "收藏成功" : "取消收藏");
      } catch (err) {
        this.$toast.fail("操作失败,请重试");
        console.log(err);
      }

      this.loading = false;
    },
  },
};
</script>

<style>
</style>