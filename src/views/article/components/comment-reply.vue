<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="
        currentComment.reply_count > 0
          ? `${currentComment.reply_count}条回复`
          : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>

    <!-- 内容部分 -->
    <div class="scroll-wrap"></div>
    <!-- 当前评论项 -->
    <comment-item :comment="currentComment"></comment-item>

    <!-- 全部回复 -->
    <van-cell title="全部回复"></van-cell>
    <comment-list
      :source="currentComment.com_id"
      :type="'c'"
      :list="commentList"
    ></comment-list>

    <!-- 写评论 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        size="small"
        round
        @click="isPostShow = true"
      >
        写评论</van-button
      >

      <!-- 发布评论弹出层 -->
      <van-popup v-model="isPostShow" position="bottom">
        <comment-post
          :target="currentComment.com_id"
          :articleId="articleId"
          @post-success="onPostSuccess"
        ></comment-post>
      </van-popup>
    </div>
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import CommentList from "./comment-list.vue";
import CommentPost from "./comment-post.vue";
export default {
  name: "CommentReply",
  components: {
    CommentItem,
    CommentList,
    CommentPost,
  },
  //接受父组件给所有后代组件提供的数据
  inject: {
    articleId: {
      type: [Object, String, Array],
      default: null,
    },
  },
  data() {
    return {
      isPostShow: false,
      commentList: [], // 评论回复列表
    };
  },
  props: {
    currentComment: {
      type: Object,
      require: true,
    },
  },
  methods: {
    //   回复发布成功事件
    onPostSuccess(data) {
      // 更新回复的数量
      this.currentComment.reply_count++;

      // 关闭弹出层
      this.isPostShow = false;

      // 将最新的回复更新到顶部
      this.commentList.unshift(data.new_obj);
    },
  },
};
</script>
<style lang="less" scoped>
// 内容部分
.scroll-wrap {
  position: fixed;
  top: 92px;
  bottom: 88px;
  left: 0;
  right: 0;
  overflow-y: auto;
}

// 评论按钮样式
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;

  .post-btn {
    width: 60%;
  }
}
</style>