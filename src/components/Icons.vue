<template>
  <view class="icon-list" :class="[compile ? 'compile' : '']">
    <view class="icon-con">
      <text class="icon-size" :class="icons.icon"></text>
    </view>
    <text class="icon-text">{{icons.text}}</text>
  </view>
</template>
<script>
export default {
  name: 'Icons',
  props: {
    icons: {
      type: [Object, Array]
    },
    compile: {
      type: Boolean
    }
  }
}
</script>
<style lang="scss" scopd>
$iconHeight: 100rpx;
.icon-list {
  // 列方式排列
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  .icon-con {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    width: $iconHeight;
    height: $iconHeight;
    margin-bottom: $iconHeight/4;
    background: linear-gradient(to right, #fc4f3c, #df4337);
    color: #fff;
    border-radius: 50%;
    .icon-size {
      font-size: 45rpx;
    }
  }
  .icon-text {
    color: rgba(0, 0, 0, .7);
    font-size: 26rpx;
  }
}
// 我的页面编辑图标
.compile {
  .icon-con {
    color: #ccc;
    background: #f5f6f8;
  }
}
</style>
