<template>
  <div class="artical-item">
    <van-cell center :to="'/article/' + artical.art_id">
      <!-- 当文本内容长度超过容器最大宽度时，自动省略多余的文本。 class="van-multi-ellipsis--l2"  最多显示两行 vant组件的style内置样式-->
      <div slot="title" class="title van-multi-ellipsis--l2">
        {{ artical.title }}
      </div>
      <div slot="label" class="label-info-warp">
        <!-- 下方图片 -->
        <div class="cover-warp" v-if="artical.cover.type === 3">
          <div
            v-for="(img, index) in artical.cover.images"
            :key="index"
            class="cover-item"
          >
            <van-image fit="cover" :src="img" class="cover-bottom" />
          </div>
        </div>
        <!-- 下方文字 -->
        <span>{{ artical.aut_name }}</span>
        <span>{{ artical.comm_count }}评论</span>
        <span>{{ artical.pubdate | relativeTime }}</span>
      </div>
      <!-- 右侧图片 -->
      <div slot="default" v-if="artical.cover.type === 1">
        <van-image
          :src="artical.cover.images[0]"
          class="cover-right"
          fit="cover"
        />
      </div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "ArticalItem",
  props: {
    artical: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style lang="less" scoped>
.artical-item {
  .title {
    color: #3a3a3a;
    font-size: 32px;
  }
  // 一张图片的样式
  //vant组件自动生成的盒子，包裹着图片
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .cover-right {
    width: 232px;
    height: 146px;
  }

  // label样式
  .label-info-warp span {
    font-size: 23px;
    color: #b4b4b4;
    margin-right: 25px;
  }

  //   三张图片样式
  .cover-warp {
    display: flex;
    padding: 30px 0;

    .cover-item {
      flex: 1;
      height: 146px;

      //   不包括父元素的最后一个孩子
      &:not(:last-child) {
        padding-right: 4px;
      }

      .cover-bottom {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>