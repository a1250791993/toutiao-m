<template>
  <div class="updateGender-container">
    <van-picker
      title="性别"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateGender",
  props: {
    value: {
      type: [Number, String],
      require: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      localGender: 0, //保存更改后的性别索引 0-男 1-女
    };
  },
  methods: {
    // 点击完成事件
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, //持续展示
      });

      try {
        let localGender = this.localGender;

        await updateUserProfile({
          gender: localGender,
        });

        // 更改视图
        this.$emit("input", localGender);

        //关闭弹层
        this.$emit("close");

        //提示成功
        this.$toast.success("更改性别成功!");
      } catch (err) {
        this.$toast.fail("更新数据失败，请稍后重试");
      }
    },
    //改变事变change 用户更改选择会得到选择后的值和索引
    onChange(picker, value, index) {
      this.localGender = index;
    },
    // 点击取消事件
    onCancel() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
</style>