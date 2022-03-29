<template>
  <div class="UpdateName-container">
    <!-- 导航栏 -->
    <van-nav-bar
      left-text="取消"
      right-text="完成"
      title="编辑昵称"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    ></van-nav-bar>

    <!-- 输入框 -->
    <div class="fieldBox">
      <van-field
        v-model.trim="localName"
        rows="1"
        autosize
        label="昵称"
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateName",
  props: {
    value: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      localName: this.value, //输入框内容
    };
  },
  methods: {
    // 点击左侧取消按钮事件
    onClickLeft() {
      this.$emit("close");
    },

    //点击右侧完成按钮事件
    async onClickRight() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, //持续展示
      });

      try {
        let localName = this.localName;

        // 判断是否为空
        if (!localName.length) {
          this.$toast("昵称不能为空");
          return;
        }

        await updateUserProfile({
          name: localName,
        });

        // 更新视图
        this.$emit("input", localName);

        // 关闭弹层
        this.$emit("close");

        // 提示成功
        this.$toast.success("更新昵称成功!");
      } catch (err) {
        this.$toast.fail("更改数据失败，请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.UpdateName-container {
  .fieldBox {
    padding: 20px;
  }
}
</style>