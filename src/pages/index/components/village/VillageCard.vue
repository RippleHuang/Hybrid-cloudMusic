<template>
  <view class="village-box on-touch"  @tap="goUserInfo">
    <view class="image">
      <image class="top-img" :src="imgUrl + '?param=200y250'" alt="">
    </view>
    <view class="content-info">
      <text class="text u-line-2">{{content}}</text>
      <view class="avatar-info">
        <image :src="avatar + '?param=50y50'" alt="">
        <text class="u-line-1">{{nickname}}</text>
        <view>{{likedCount | filterPlayCount}}赞 <text class="iconfont icon-sandian"></text></view>
      </view>
    </view>
  </view>
</template>
<script>
import { filterPlayCount } from '@/common/filters'
export default {
  name: 'VillageCard',
  props: {
    content: {
      type: String
    },
    likedCount: {
      type: Number
    },
    nickname: {
      type: String
    },
    avatar: {
      type: String
    },
    imgUrl: {
      type: String
    },
    userId: {
      type: Number
    }
  },
  methods: {
    goUserInfo () {
      if (this.$store.state.loginState) this.$router.push('/userInfo??accountUid=' + this.userId)
      else uni.showToast({title: '需要登录', icon: 'none'})
    }
  },
  filters: {
    filterPlayCount
  }
}
</script>
<style lang='scss' scoped>
.village-box {
  width: $width*0.45;
  margin: 10rpx 0;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .15), 0 0 6px rgba(0, 0, 0, .05);
  .top-img {
    width: $width*0.45;
    height: 400rpx;
  }
  .content-info {
    font-size: 22rpx;
    .text {
      margin: 15rpx;
      color: black;
      font-size: 27rpx;
      line-height: 1.2;
    }
    .avatar-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10rpx;
      image {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
      }
      .u-line-1 {
        width: 150rpx;
      }
      .icon-sandian {
        margin-left: 10rpx;
        font-size: 20rpx;
      }
    }
  }
}
</style>
