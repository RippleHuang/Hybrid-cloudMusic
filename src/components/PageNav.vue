<template>
  <view class="nav-con">
    <view class="mask" :style="[{display: isFixedSong ? 'block' : 'none', height}]"></view>
    <view class="mask1" v-if="imgUrl" :style="[{ background: `url(${imgUrl}) center` }]"></view>
    <view class="page-nav" :style="[{ background, height }]">
      <view class="left">
        <text class="iconfont icon-zuo" @tap="rollback"></text>
        <!-- 播放页 -->
        <view class="play" v-if="playName">
          <text class="play-title">{{playName}}</text>
          <view class="all-nickname u-line-1">
            <text class="nickname" v-for="(item, index) in artist" :key="index">
              {{item.name}}
            </text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>
        <!-- 歌单 -->
        <view class="song-show-nav" v-if="songList">
          <text class="title" :class="[{animation: isFixedTitle}]">{{title}}</text>
        </view>
        <!-- 默认 -->
        <text v-if="defaultShow">{{title}}</text>
        <!-- 用户信息页 -->
        <text :style="[{display: isFixed ? 'inline-block' : 'none'}]">{{title}}</text>
      </view>
      <!-- #ifndef MP -->
      <!-- 歌单 -->
      <view class="icons" v-if="songList" @click="no">
        <text class="iconfont icon-sousuo"></text>
        <text class="iconfont icon-sandian"></text>
      </view>
      <!-- 分享 -->
      <text v-if="share" class="iconfont icon-fenxiang"></text>
      <!-- #endif -->
    </view>
  </view>
</template>
<script>
export default {
  name: 'DefaultNav',
  props: {
    title: {
      type: String
    },
    defaultShow: {
      type: Boolean
    },
    background: {
      type: String
    },
    share: {
      type: Boolean
    },
    isFixed: {
      type: Boolean
    },
    height: {
      type: String
    },
    playName: {
      type: String
    },
    artist: {
      type: Array
    },
    songList: {
      type: Boolean
    },
    isFixedTitle: {
      type: Boolean
    },
    imgUrl: {
      type: String
    },
    isFixedSong: {
      type: Boolean
    },
    compile: {
      type: Boolean
    }
  },
  methods: {
    rollback () {
      // 转化为迷你播放器
      if (this.playName) {
        this.$store.commit('SET_FULL_SCREEN', false)
      } else if (this.compile) {
        this.$emit('compiled')
      } else {
        uni.navigateBack({
          delta: 1,
          animationType: 'pop-out',
          animationDuration: 200
        })
      }
    },
    no () {
      uni.showToast({title: '该功能尚未实装,敬请期待', icon: 'none'})
    }
  }
}
</script>
<style lang='scss' scoped>
.nav-con {
  position: relative;
  width: $width;
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 4;
    width: $width;
    height: 160rpx;
    background-color: rgb(148, 142, 142);
    &::after {
      content: '.';
      opacity: 0;
    }
  }
  .mask1 {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 4;
    width: $width;
    height: 160rpx;
    -webkit-filter: blur(15px);
    filter: blur(15px);
    &::after {
      content: '.';
      opacity: 0;
    }
  }
  .page-nav {
    position: fixed;
    top: 0;
    z-index: 5;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: $width;
    height: $height;
    padding: 0 20rpx;
    /* #ifndef APP-PLUS || MP */
    line-height: $height;
    /* #endif */
    /* #ifndef H5 */
    padding: var(--status-bar-height) 20rpx 0;
    /* #endif */
    color: #fff;
    font-size: 42rpx;
    .left {
      .icon-zuo {
        display: inline-block;
        height: $height;
        padding-right: 40rpx;
        font-size: 42rpx;
      }
      .play {
        position: absolute;
        left: 90rpx;
        top: 23rpx;
        /* #ifndef H5 */
        top: var(--status-bar-height);
        /* #endif */
        display: flex;
        flex-direction: column;
        width: $width*0.75;
        line-height: 1.3;
        overflow: hidden;
        .play-title {
          width: $width*0.75;
          font-size: 34rpx;
          white-space: nowrap;
          animation: 15s wordsLoop linear infinite normal;
        }
        .all-nickname {
          width: $width*0.75;
          height: 30rpx;
          line-height: .5;
          .nickname {
            font-size: 22rpx;
            color: rgb(192, 190, 190);
            &::before {
              content: "/";
              font-size: 20rpx;
            }
            &:first-of-type::before {
              content: "";
            }
          }
          .icon-arrow-right {
            height: 30rpx;
            padding: 0;
            margin-left: -1px;
            font-size: 20rpx;
            line-height: 30rpx;
            text-align: center;
            color: rgb(187, 182, 182);
          }
        }
      }
      text {
        font-size: 36rpx;
      }
      .song-show-nav {
        @extend .play;
        top: 38rpx;
        /* #ifndef H5 */
        top: calc(6px + var(--status-bar-height));
        /* #endif */
        width: $width*0.65;
        .title {
          width: $width*0.65;
          font-size: 34rpx;
          white-space: nowrap;
        }
      }
    }
    .icons {
      display: flex;
      justify-content: space-between;
      width: $height;
      text {
        font-size: 42rpx;
      }
    }
    .icon-fenxiang {
      font-size: 42rpx;
    }
  }
}
.animation {
  animation: 15s wordsLoop linear infinite normal;
}
// 循环滚动
@keyframes wordsLoop {
  0% {
    transform: translateX(75vw);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
