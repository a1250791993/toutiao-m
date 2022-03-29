<template>
  <div class="update-photo">
    <img :src="img" alt="" ref="img" />

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
// 下载了第三方工具 裁剪图片的工具 cropperjs 使用时候，必须把img放在一个块级盒子里面 也要保证Img大小完全填充到容器当中
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserPhoto } from "@/api/user";
export default {
  name: "UpdatePhoto",
  props: {
    img: {
      type: [String, Object],
      require: true,
    },
  },
  data() {
    return {
      cropper: null, //存储裁剪之后的图片对象
    };
  },
  methods: {
    //   点击完成事件
    onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, //持续展示
      });
      // 基于服务端的裁剪使用getDate()方法获取裁切参数
      //   console.log(this.cropper.getData());
      // 纯客服端的裁切使用getCroppedCanvas()方法获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        //   错误用法

        //    如果接口要求是Content-Type	application/json axios自动会转换成这个
        // 则传递普通的Js对象
        // updateUserPhoto({
        //     ...
        // })
        // 如果接口要求是Content-Type	multipart/form-data 常见于文件上传
        // 则传递FormData对象
        try {
          const formData = new FormData();
          formData.append("photo", blob);

          const { data } = await updateUserPhoto(formData);

          // 关闭弹出层
          this.$emit("close");
          // 更新视图
          this.$emit("update-photo", data.data.photo);
          // 提示成功
          this.$toast.success("更新头像成功!");
        } catch (err) {
          this.$toast.fail("更新头像失败！");
        }
      });
    },
  },
  mounted() {
    //   操作DOM元素
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },
};
</script>

<style lang="less" scoped>
.update-photo {
  height: 100%;
  background-color: #000;
  .toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;

    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }

    img {
      display: block;
      max-width: 100%;
    }
  }
}
</style>