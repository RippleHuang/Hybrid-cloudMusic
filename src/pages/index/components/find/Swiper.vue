<template>
  <view class="swiper-con">
    <view class="swipe-content">
      <u-swiper
        :list="swiperList"
        name="pic"
        @change="change"
        interval="5000"
        mode="dot"
        border-radius="15"
      >
      </u-swiper>
      <block v-for="(item, index) in swiperList" :key="index">
        <text class="title" :style="[{background:item.titleColor}]" :class="ind === index ? 'show-block' : ''">
          {{item.typeTitle}}
        </text>
      </block>
    </view>
    <view class="mask"></view>
  </view>
</template>
<script>
import { bannerSwiper } from '@/api/apis'
export default {
  name: 'Swiper',
  data () {
    return {
      swiperList: [],
      ind: 0
    }
  },
  methods: {
    getBannerSwiper () {
      bannerSwiper()
        .then(data => {
          this.swiperList = data.banners
          this.swiperList.forEach(item => {
            item.pic += '?param=400y150'
          })
        })
    },
    change (index) {
      this.ind = index
    }
  },
  mounted () {
    this.getBannerSwiper()
  }
}
</script>
<style lang="scss" scoped>
$swiperHeigth: 300rpx;
$titleHeigth: 50rpx;
.swiper-con {
  position: relative;
  width: $width;
  height: $swiperHeigth;
  .swipe-content {
    position: relative;
    width: $width*0.928;
    margin: 0 auto;
    padding: $titleHeigth*0.5 0;
    box-sizing: border-box;
    .title {
      position: absolute;
      right: 0;
      bottom: $titleHeigth*0.5;
      display: none;
      height: $titleHeigth;
      line-height: $titleHeigth;
      padding: 0 $titleHeigth*0.25;
      color: #fff;
      font-size: 24rpx;
      border-radius: $titleHeigth*0.25 0 $titleHeigth*0.25 0;
      opacity: .9;
    }
  }
  .mask {
    position: absolute;
    top: 0;
    z-index: -3;
    width: $width;
    height: $swiperHeigth*0.75;
    background:  $defaultColor;
  }
}
</style>
