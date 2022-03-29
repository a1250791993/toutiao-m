<template>
  <div class="updateBirthday-container">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="onCancel"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "UpdateBirthday",
  props: {
    value: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(), //当前时间为最大日期
      currentDate: new Date(this.value), //点开日期选择之后，选择的值，给了一个默认值this.value
    };
  },
  methods: {
    //   点击取消事件
    onCancel() {
      this.$emit("close");
    },

    // 点击完成事件
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, //持续展示
      });

      try {
        let currentDate = dayjs(this.currentDate).format("YYYY-MM-DD");

        await updateUserProfile({
          birthday: currentDate,
        });

        // 更改视图
        this.$emit("input", currentDate);

        //关闭弹层
        this.$emit("close");

        //提示成功
        this.$toast.success("更改性别成功!");
      } catch (err) {
        this.$toast.fail("更新数据失败，请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>