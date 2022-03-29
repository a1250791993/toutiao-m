<template>
  <!-- immediate-check  是否在初始化时立即执行滚动位置检查
   因为我们初始化时候自己调用了一次渲染方法，就不让他自己调用了 -->
  <van-list
    :immediate-check="false"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
  >
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    ></CommentItem>
    <!-- <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.content"
    /> -->
  </van-list>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item.vue";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, Object, String],
      require: true,
    },
    type: {
      type: String,
      // 自定义的props数据验证
      Validator(value) {
        return ["a", "b"].includes(value);
      },
      default: "a",
    },
    list: {
      type: Array,
      //默认值
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      error: false,
      offset: null,
      limit: 10,
    };
  },
  methods: {
    async onLoad() {
      this.loading = true;

      try {
        //   1.获取数据
        const { data } = await getComments({
          type: this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), //源id，文章id或评论id
          offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });

        // 2.将数据添加到数组
        const { results, total_count } = data.data;
        this.list.push(...results);

        // 2.1将评论总数传出去
        this.$emit("success-loading", total_count);

        // 3.将loading关闭
        this.loading = false;

        // 4判断是否还有数据
        if (results.length) {
          // 有
          this.offset = data.data.last_id;
        } else {
          // 没有
          this.finished = true;
        }
      } catch (err) {
        this.loading = false;
        this.error = true;
        this.$toast.fail("获取数据失败，请稍后重试");
        console.log(err);
      }

      this.loading = false;
    },
  },
  created() {
    // 自己手动初始化loading ,他不会自动初始loading
    // 所以我们要手动开启loading
    this.loading = true;
    //   调用一次onload方法，因为如果页面不下滑到List组件处，没有数据，就无法获取到评论总数
    this.onLoad();
  },
};
</script>

<style>
</style>