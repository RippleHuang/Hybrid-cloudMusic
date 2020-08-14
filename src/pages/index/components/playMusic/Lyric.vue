<template>
  <view class="wrapper" @tap="goImg">
    <view class="full" v-if="noLyric">{{noLyricText}}</view>
    <view class="lyric-ul" :style="[{marginTop: marginTop}]">
      <view
        class="lyric-li"
        v-for="(item, index) in lyricArray"
        :key="index"
        :class="[{active: index === nowLyricIndex}]"
      >
        {{ item | setWords }}
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'Lyric',
  props: {
    lyricArray: {
      type: Array
    },
    // 当前播放的歌词索引
    nowLyricIndex: {
      type: Number
    },
    noLyric: {
      type: Boolean
    },
    noLyricText: {
      type: String
    },
    marginTop: {
      type: String
    }
  },
  filters: {
    setWords: function (val) {
      if (val && val.words) {
        return val.words
      }
    }
  },
  methods: {
    setCurrent (index) {
      // 每次移动是移动一行歌词的高度，一行歌词高度是 40px
      // 120为高亮歌词距离顶部位置
      const top = 120 - index * 40
      // top 不能为正数
      this.marginTop = top > 0 ? 0 : top + 'px'
    },
    goImg () {
      this.$emit('goImg')
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  position: absolute;
  top: $height;
  bottom: 280rpx;
  width: $width;
  padding: 0 50rpx;
  box-sizing: border-box;
  color: rgb(192, 190, 190);
  overflow: hidden;
  .lyric-ul {
    position: relative;
    z-index: 1; // 解决过渡效果带来的字体模糊
    margin: 0;
    padding-top: 200rpx;
    list-style: none;
    text-align: center;
    transition: margin-top .35s ease-out;
    // 解决过渡效果带来的抖动
    transform: translateZ(0);
    .lyric-li {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      line-height: 1.3;
      font-size: 32rpx;
      text-align: center;
    }
  }
  .active {
    color: #fff;
  }
  .full {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
  }
}
</style>
