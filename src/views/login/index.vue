<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon name="cross" slot="left" @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录表单 -->
    <!-- 表单验证：
    1.给van-field组件配置rules验证规则
    2.当表单提交的时候自动触发表单验证
     如果验证通过，会触发submit 
     如果验证失败，不会触发submit -->
    <van-form @submit="onSubmit" ref="loginForm">
      <!-- 手机号 -->
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>

      <!-- 验证码 -->
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <!-- 小图标 -->
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>

        <!-- 获取验证码按钮 -->
        <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button，否则会触发表单提交。 -->
        <template #button>
          <!-- 倒计时面板 -->
          <van-count-down
            v-if="isCountdownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountdownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            >获取验证码</van-button
          >
        </template>
      </van-field>

      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
export default {
  name: "LoginIndex",
  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "", //验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
      },
      code: [
        {
          required: true,
          message: "验证码不能为空",
        },
        {
          pattern: /^\d{6}$/,
          message: "验证码格式错误",
        },
      ],
      isCountdownShow: false,
    };
  },
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user;

      //在组件中必须通过this.$toast来调用Toast组件
      //   网络慢时候，显示loading
      this.$toast.loading({
        message: "登陆中...",
        forbidClick: true, //禁用背景点击
        duration: 0, //持续时间，默认2000 ,如果为0，则持续展示
      });

      // 2.提交表单请求登录
      try {
        const { data } = await login(this.user);
        this.$store.commit("setUser", data.data);
        // console.log(res);
        this.$toast.success("登录成功");

        // 登录成功跳转页面
        this.$router.back();
      } catch (err) {
        if (err.response.status === 404) {
          this.$toast.fail("手机号或者验证码错误");
        } else {
          this.$toast.fail("登陆失败,请重新登录", err);
        }
      }
      // 4.格局请求相应结果处理后续操作
    },
    async onSendSms() {
      // 1.验证手机号表单
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        // 验证失败不往下执行
        return console.log("验证失败", err);
      }
      // 2. 验证成功 倒计时开始
      this.isCountdownShow = true;
      // 3.发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast("发送验证码成功");
      } catch (err) {
        this.isCountdownShow = false;
        if (err.response.status === 404) {
          this.$toast("发送验证码太频繁，请稍后重试");
        } else {
          this.$toast("发送验证码失败，清稍后重试");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
//图标样式
.login-container {
  .iconfont {
    font-size: 37px;
  }
}

// 验证码按钮样式
.send-btn {
  height: 46px;
  line-height: 46px;
  background-color: #ededed;
  font-size: 22px;
}

// 登录按钮样式
.login-btn-wrap {
  margin: 53px 28px 0 28px;
  .van-button--info {
    background-color: #6db4fb;
    border-color: #6db4fb;
  }
}
</style>