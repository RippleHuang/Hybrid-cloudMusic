<template>
  <div class="loading-svg" :style="[{ 'height':`${height*50}px`, position}]">
    <div class="bar">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    努力加载中...
  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    height: {
      type: Number
    },
    position: {
      type: String
    }
  }
}
</script>
<style lang='scss' scoped>
.loading-svg {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
  width: $width;
  border-radius: 40rpx 40rpx 0 0;
  .bar {
    display: flex;
    justify-content: center;
    flex-flow: row nowrap;
    width: 90rpx;
    height: 50rpx;
    margin-top: 16rpx;
    span {
      width: 8rpx;
      height: 50rpx;
      margin-left: 3px;
      background-color: $defaultColor;
    }
    span:nth-of-type(1) {
      animation: grow 1s -0.45s ease-in-out infinite;
    }
    span:nth-of-type(2) {
      animation: grow 1s ease-in-out infinite;
    }
    span:nth-of-type(3) {
      animation: grow 1s -0.45s ease-in-out infinite;
    }
    span:nth-of-type(4) {
      animation: grow 1s ease-in-out infinite;
    }
  }
}
@keyframes grow {
  0%,
  100% {
    height: 30rpx;
  }

  50% {
    height: 50rpx;
    margin-top: -20rpx;
  }
}
</style>
