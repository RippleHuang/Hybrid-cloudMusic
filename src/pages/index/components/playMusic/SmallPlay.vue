<template>
  <view class="small-play">
    <view class="music" @tap="returnFull">
      <view class="img-info" :style="[{animationPlayState: playState ? 'running' : 'paused'}]" v-if="imgUrl">
        <image :src="imgUrl + '?param=80y80'">
      </view>
      <view class="music-info">
        <text class="music-name">{{name}}</text>
        <text class="music-lrc u-line-1" v-show="nowLyric">{{ nowLyric }}</text>
        <view class="music-lrc u-line-1" v-show="!nowLyric">
          <text class="nickname" v-for="(item, index) in artist" :key="index">
            {{item.name}}
          </text>
        </view>
      </view>
    </view>
    <view class="func">
      <view class="left on-touch"  @tap="play">
        <u-circle-progress
          :percent="progressWidth"
          :width="60"
          :border-width="4"
          active-color="#d03c32"
          inactive-color="#999696"
          :duration="allTime * progressWidth * 10"
        >
          <text
            class="iconfont"
            :class="[{'icon-gedanbofangliang_': !playState, 'icon-zantingtingzhi': playState}]"
          >
          </text>
        </u-circle-progress>
      </view>
      <view class="right on-touch" @tap="showAudioList">
        <text class="iconfont icon-icon-test"></text>
      </view>
    </view>
  </view>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SmallPlay',
  props: {
    imgUrl: {
      type: String
    },
    name: {
      type: String
    },
    artist: {
      type: Array
    },
    progressWidth: {
      type: Number,
      default: 0
    },
    allTime: {
      type: Number,
      default: 0
    },
    nowLyric: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['playState'])
  },
  methods: {
    play () {
      this.$emit('play')
    },
    returnFull () {
      this.$store.commit('SET_FULL_SCREEN', true)
    },
    showAudioList () {
      this.$emit('showAudioList')
    }
  }
}
</script>
<style lang="scss" scoped>
$smallPlayHeight: 100rpx;
.small-play {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $smallPlayHeight;
  background-color: #fff;
  overflow: hidden;
  .music {
    display: flex;
    justify-content: space-between;
    .img-info {
      display: flex;
      justify-content: center;
      align-items: center;
      width: $smallPlayHeight;
      height: $smallPlayHeight;
      animation: rotating 22s linear infinite;
      transform-origin: center;
      image {
        width: $smallPlayHeight*0.8;
        height: $smallPlayHeight*0.8;
        border-radius: 50%;
      }
    }
    .music-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: $smallPlayHeight;
      width: $width*0.6;
      overflow: hidden;
      // 歌名
      .music-name {
        margin: 0;
        padding: 1rpx 0 1rpx;
        font-size: 28rpx;
        white-space: nowrap;
        overflow: hidden;
      }
      // 歌词
      .music-lrc {
        width: $width*0.6;
        margin: 1rpx 0 0;
        padding-bottom: 1rpx;
        font-size: 22rpx;
        color: #999696;
        overflow: hidden;
        .nickname {
          padding-bottom: 1rpx;
          font-size: 22rpx;
          color: #7f7f7f;
          &::before {
            content: "/";
            font-size: 20rpx;
          }
          &:first-of-type::before {
            content: "";
          }
        }
      }
    }
  }
  .func {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex: 1;
    height: $smallPlayHeight;
    .left {
      @extend .right;
      text {
        font-size: 28rpx;
      }
      .icon-zantingtingzhi {
        color: $defaultColor;
      }
    }
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: $smallPlayHeight;
      .icon-icon-test {
        font-size: 50rpx;
      }
    }
  }
  .music:active, .music:active + .func {
    background-color: #e1e1e4;
  }
}
// 图片旋转
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
