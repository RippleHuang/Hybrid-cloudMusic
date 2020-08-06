<template>
  <view class="img-card" :style="{width}">
    <!-- 发现页面歌单显示播放数 -->
    <view class="tag" v-if="playCount">
      <text class="iconfont icon-gedanbofangliang_"></text>
      {{playCount | filterPlayCount}}
    </view>
    <view class="img-con">
      <!-- 发现页面新歌图标 -->
      <view class="newsong-icon" v-if="newPlatetype === 'newSong'">
        <text class="iconfont icon-bofang"></text>
      </view>
      <!-- 蒙版 -->
      <view class="mask on-touch"></view>
      <!-- 排行榜time更新 -->
      <text class="time" v-if="updateTime">{{ updateTime }}</text>
      <!-- 图片地址加上 ?param=数字y数字 可以控制尺寸 -->
      <image class="image-con" :src="url + '?param=150y150'" alt="" @load="imgLoad" />
    </view>
    <view v-if="songtitle" class="songtitle u-line-2" >{{ songtitle }}</view>
  </view>
</template>
<script>
import { filterPlayCount } from '@/common/filters'
export default {
  name: 'ImgCard',
  props: {
    playCount: {
      type: Number
    },
    url: {
      type: String
    },
    songtitle: {
      type: String
    },
    albumId: {
      type: Number
    },
    newPlatetype: {
      type: String
    },
    width: {
      type: String
    },
    updateTime: {
      type: String
    }
  },
  filters: {
    filterPlayCount
  },
  methods: {
    imgLoad () {
      this.$emit('loadingImg', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.img-card {
  position: relative;
  width: $width*0.29;
  margin-bottom: 35rpx;
  .tag {
    position: absolute;
    z-index: 3;
    top: 11rpx;
    right: 11rpx;
    font-size: 25rpx;
    letter-spacing: 0;
    color: #fff;
    .icon-gedanbofangliang_ {
      color: #fff;
      font-size: 22rpx;
      margin-right: 8rpx;
    }
  }
  .time {
    position: absolute;
    left: 20rpx;
    bottom: 20rpx;
    font-size: 22rpx;
    color: #fff;
  }
  .img-con {
    position: relative;
    height: $width*0.29;
    border-radius: 10rpx;
    overflow: hidden;
    .newsong-icon {
      position: absolute;
      top: 70%;
      right: 7.5%;
      z-index: 3;
      display: flex;
      justify-content: center;
      align-items: center;
      width: $width*0.29*0.25;
      height: $width*0.29*0.25;
      border-radius: 50%;
      background-color: rgb(255, 255, 255, .8);
      overflow: hidden;
      .icon-bofang {
        display: flex;
        align-items: center;
        color: $defaultColor;
        font-size: 26rpx;
      }
    }
    .mask {
      position: absolute;
      width: $width*0.29;
      height: $width*0.29;
      z-index: 2;
      border-radius: 10rpx;
      overflow: hidden;
      box-shadow: 0 12px 18px -8px rgb(110, 109, 109) inset;
    }
    .image-con {
      width: $width*0.29;
      height: $width*0.29;
    }
  }
  .songtitle {
    padding-top: 13rpx;
    line-height: 1.2;
    box-sizing: border-box;
    font-size: 28rpx;
    letter-spacing: none;
    // 字母不换行
    word-break: break-all;
  }
}
</style>
