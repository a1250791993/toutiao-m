<template>
  <div class="search-suggestion-container">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="hightLight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { getSuggestions } from "@/api/search";
export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      suggestions: [], //联想列表数组
    };
  },
  methods: {
    //获取联想建议方法
    async loadSuggestions(q) {
      try {
        const { data } = await getSuggestions(q);
        this.suggestions = data.data.options;
      } catch (err) {
        this.$toast("获取数据失败，请稍后尝试");
      }
    },
    //搜索高亮方法
    hightLight(text) {
      const hightLight = `<span class="active">${this.searchText}</span>`;
      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, hightLight);
    },
  },
  watch: {
    searchText: {
      // 当监听内容改变是会调用handler函数，名字是固定的
      // debounced防抖函数
      handler: debounce(function (value) {
        // 调用获取联想建议方法
        this.loadSuggestions(value);
      }, 1000),
      immediate: true, //改函数在监听开始时立即调用一次
    },
  },
};
</script>

<style lang="less" scoped>
.search-suggestion-container {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>