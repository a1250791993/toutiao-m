<template>
  <div class="search-history-container">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('upData-history')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="text"
      v-for="(text, index) in search_history"
      :key="index"
      @click="onSearchDelete(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  props: {
    /* 
       props数据

       如果是普通数据：数字，字符串，布尔值，不能修改，即便改了，也不会传到父组件

       如果是引用型数据 ：数组，对象
            可以修改 例如 .push() ,对象.xxx =xxx
            不能重新赋值  例如 xxx= []
    */
    search_history: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      isDeleteShow: false,
    };
  },
  methods: {
    onSearchDelete(item, index) {
      if (isDeleteShow) {
        // 删除状态
        this.search_history.splice(index, 1);
      } else {
        // 非删除状态
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>