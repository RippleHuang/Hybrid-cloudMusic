<template>
  <view class="video">
    <view
      class="video-for on-touch"
      v-for="(item, index) in videoData" :key="index"
      @tap="goPlay(item.vid, item.type)"
    >
      <view class="img-info">
        <view class="tag">
          <text class="iconfont icon-gedanbofangliang_"></text>
          {{item.playTime | filterPlayCount}}
        </view>
        <image :src="item.coverUrl + '?param=300y150'" alt />
      </view>
      <view class="info" :style="[{width: search ? '200px' : '160px'}]">
        <text class="name u-line-2">{{ item.title }}</text>
        <view class="artist van-ellipsis">
          <text class="time">{{item.durationms | filterSetTime}} by</text>
          <text class="creator" v-for="(creator, index) in item.creator" :key="index">{{creator.userName}}</text>
        </view>
      </view>
      <view class="artists-compile" v-if="!search">
        <text class="iconfont icon-sandian" @tap.stop="no"></text>
      </view>
    </view>
  </view>
</template>
<script>
import { filterPlayCount, filterSetTime } from '@/common/filters'
export default {
  name: 'VideoList',
  props: {
    videoData: {
      type: [Object, Array]
    },
    search: {
      type: Boolean
    }
  },
  methods: {
    no () {
      uni.showToast({title: '暂不支持,敬请期待', icon: 'none'})
    },
    goPlay (id, type) {
      uni.navigateTo({
        url: `../landscape/Landscape?vid=${id}&type=${type}`,
        animationType: 'pop-in',
        animationDuration: 200
      })
    }
  },
  filters: {
    filterPlayCount,
    filterSetTime
  }
}
</script>
<style lang='scss' scoped>
.video-for {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 30rpx;
  .img-info {
    position: relative;
    width: 260rpx;
    height: 150rpx;
    .tag {
      position: absolute;
      top: 11rpx;
      right: 11rpx;
      font-size: 23rpx;
      letter-spacing: 0;
      color: #fff;
      .icon-gedanbofangliang_ {
        color: #fff;
        font-size: 21rpx;
      }
    }
    image {
      width: 260rpx;
      height: 150rpx;
      border-radius: 10rpx;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    padding: 0 15rpx;
    .name {
      color: black;
      line-height: 1.3;
      font-size: 30rpx;
    }
    .artist {
      padding-top: 10rpx;
      font-size: 24rpx;
      color: #aaa;
    }
  }
}
</style>
