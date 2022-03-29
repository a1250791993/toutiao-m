<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <!-- article里面有数据代表请求成功，随便拿里面一条数据作为判断 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 模板当中，事件参数通过$event获取 -->
          <FollowUser
            :isFollow="article.is_followed"
            :user-id="article.aut_id"
            class="follow-btn"
            @updata-is_followed="article.is_followed = $event"
          ></FollowUser>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>

        <van-divider>正文结束</van-divider>

        <!-- 评论部分 -->
        <CommentList
          :list="commentList"
          :source="article.art_id"
          @success-loading="totalCount = $event"
          @reply-click="onReplyClick"
        ></CommentList>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="showPopup"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCount" color="#777" />
          <CollectArticle
            v-model="article.is_collected"
            :art-id="article.art_id"
          ></CollectArticle>
          <LikeArticle
            v-model="article.attitude"
            :art-id="article.art_id"
          ></LikeArticle>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 弹出层内容(评论,对文章进行评论) -->
        <van-popup v-model="show" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 回复里面评论的弹层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <comment-reply
        v-if="isReplyShow"
        :current-comment="currentComment"
        @close="isReplyShow = false"
      ></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from "@/api/artical";
import CollectArticle from "@/components/collect-article";
import FollowUser from "@/components/follow-user";
import LikeArticle from "@/components/like-article";
import CommentList from "./components/comment-list.vue";
import CommentPost from "./components/comment-post.vue";
import CommentReply from "./components/comment-reply.vue";
// 引入图片预览组件(vant)
import { ImagePreview } from "vant";

export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
  //给所有后代组件提供数据
  provide: function () {
    return {
      articleId: this.articleId,
    };
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, //文章详情
      loading: true, //加载中的状态
      errStatus: 0, // 失败的状态码
      followLoading: false, //关注加载状态的控制
      totalCount: 0, //评论总数
      show: false, //文章写评论弹出层显示状态
      commentList: [], //评论列表数组
      isReplyShow: false, //回复评论里面的弹层状态
      currentComment: [], //当前点击回复的评论项目
    };
  },
  computed: {},
  watch: {},
  created() {
    // 调用获取文章方法;
    this.loadArticle();
  },
  mounted() {},
  methods: {
    // 获取文章的方法
    async loadArticle() {
      try {
        //加载失败时候，点击重试，要重新加载,即loading 也要重新为true
        this.loading = true;

        const { data } = await getArticleById(this.articleId);

        // 模仿加载失败时候
        // if (Math.random() > 0.5) {
        //   JSON.parse("dasdsadasdasdasdsad");
        // }

        // 数据驱动试图不是立即更新的
        this.article = data.data;

        // 所以设置一个延时器
        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImages();
        }, 0);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
        console.log(err);
      }

      // 无论成功失败都要关闭loading
      this.loading = false;
    },

    //返回事件
    onClickLeft() {
      this.$router.back();
    },

    //点击 写评论弹出层显示方法
    showPopup() {
      this.show = true;
    },
    //图片相关方法
    previewImages() {
      // 得到所有的Img节点
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");

      // 获取所有img地址
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);

        // 给每个img设置点击事件
        img.onclick = () => {
          ImagePreview({
            //预览图片的数组，es6简写名字一样
            images,

            // 指定初始图片
            startPosition: index,
          });
        };
      });
    },

    //写评论弹出层组件传出来的方法
    onPostSuccess(data) {
      // 关闭弹出层
      this.show = false;
      // 将评论显示到顶部
      this.commentList.unshift(data.new_obj);
    },

    //回复功能弹出层方法
    onReplyClick(comment) {
      this.currentComment = comment;

      this.isReplyShow = true;
    },
  },
};
</script>

<style scoped lang="less">
//文章正文样式，下载的
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>