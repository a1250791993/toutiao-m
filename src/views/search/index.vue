<template>
  <div class="search-container">
    <!-- 搜索框 ---------------------------- -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText"></search-result>

    <!-- 联想建议 -------------------------------------------- -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    ></search-suggestion>

    <!-- 历史记录 ------------------------------->
    <search-history
      v-else
      :search_history="searchHistories"
      @upData-history="onloadHistory"
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from "./components/search-history.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
import SearchResult from "./components/search-result.vue";
import { getItem, setItem } from "@/utils/storage";
export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  data() {
    return {
      searchText: "",
      isResultShow: false, //控制搜索结果的展示
      searchHistories: getItem("TOUTIAO_HISTORY") || [], //存储历史记录
    };
  },
  methods: {
    // 搜索框搜索事件
    onSearch(val) {
      // 更新搜索框
      this.searchText = val;

      // 存储搜索历史内容
      // 要求：不能有重复，最新的在最前面
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(val);

      // 显示搜索结果
      this.isResultShow = true;
    },

    // 搜索框取消按钮事件
    onCancel() {
      this.$router.back();
    },

    //历史记录全部删除方法
    onloadHistory() {
      this.searchHistories = [];
    },
  },

  watch: {
    searchHistories: {
      handler(val) {
        setItem("TOUTIAO_HISTORY", val);
      },
    },
  },
};
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;

  // 取消文字的颜色
  .van-search__action {
    color: #fff;
  }

  // 搜索框样式
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
}
</style>