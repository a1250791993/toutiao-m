<template>
  <div class="search-result-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getResult } from "@/api/search";
export default {
  name: "SearchResult",
  props: {
    searchText: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 控制页数
      prePage: 20, //每一页的数量
      error: false,
    };
  },
  methods: {
    async onLoad() {
      try {
        // 1.获取数据
        const { data } = await getResult({
          page: this.page,
          pre_page: this.prePage,
          q: this.searchText,
        });

        // 2.把数据放到数组里面
        const { results } = data.data;
        this.list.push(...results);

        // 3.将本次加载关闭
        this.loading = false;

        // 4.判断是否还有数据
        if (results.length) {
          //有就加载下一页
          this.page++;
        } else {
          // 没有
          this.finished = true;
        }
      } catch (err) {
        // 加载失败的提示状态
        this.error = true;

        //关闭记载状态
        this.loading = false;

        this.$toast("加载数据失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>