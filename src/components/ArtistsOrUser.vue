<template>
  <view class="artists">
    <view
      class="artists-for on-touch"
      v-for="(item, index) in otherData" :key="index"
      @tap="goUserInfo(item.userId)"
    >
      <view class="img-info">
        <image :src="(item.picUrl ? item.picUrl : item.img1v1Url ? item.img1v1Url : (item.coverUrl || item.avatarUrl)) + '?param=80y80'" alt />
      </view>
      <view class="info">
        <view class="name">
          <view class="u-line-1">
            {{ item.name || item.nickname }}
            <text v-if="item.alias != null">({{item.alias[0]}})</text>
          </view>
          <text class="iconfont icon-nan" style="color: #6eccff;" v-if="item.gender === 1"></text>
          <text class="iconfont icon-nv" style="color: #fd79a8;" v-if="item.gender === 2"></text>
        </view>
        <view class="production">
          <text class="text" v-if="!user">专辑：{{item.albumSize}}</text>
          <text class="text" v-if="!user">MV：{{item.mvSize}}</text>
          <text class="text u-line-1" :style="[{display: user ? 'inline-block' : 'block'}]" v-if="user">{{item.description || item.signature}}</text>
        </view>
      </view>
      <view class="artists-compile" @tap.stop="no">
        <!-- 歌手 -->
        <view class="artist" v-if="songer">
          <text class="iconfont icon-yonghu"></text> 已入驻
        </view>
        <!-- 用户 -->
        <button class="add-button" v-if="user">
         <text class="iconfont icon-jia"></text> 关注
        </button>
        <!-- 收藏歌手 -->
        <text class="iconfont icon-sandian" v-if="favorite"></text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'ArtistsOrUser',
  props: {
    otherData: {
      type: [Object, Array]
    },
    user: {
      type: Boolean
    },
    songer: {
      type: Boolean
    },
    favorite: {
      type: Boolean
    }
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    goUserInfo (id) {
      if (this.user) {
        if (this.$store.state.loginState) {
          uni.navigateTo({
            url: '/otherPages/userInfo/userInfo?accountUid=' + id,
            animationType: 'pop-in',
            animationDuration: 200
          })
        }
        else this.toast('需要登录')
      } else {
        this.toast('尚未实装,敬请期待')
      }
    },
    no () {
      this.toast('尚未实装,敬请期待')
    }
  }
}
</script>
<style lang='scss' scoped>
.artists-for {
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx;
  .img-info {
    width: 100rpx;
    height: 100rpx;
    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 20rpx;
    .name {
      display: flex;
      width: 55vw;
      font-size: 32rpx;
      color: black;
      line-height: 1.5;
      text {
        font-size: 22rpx;
        margin-left: 10rpx;
      }
    }
    .production {
      .text {
        width: 55vw;
        color: #999;
        font-size: 20rpx;
        line-height: 1.5;
        &:nth-of-type(2) {
          margin-left: 10rpx;
        }
      }
    }
  }
  .artist {
    display: flex;
    align-items: center;
    font-size: 20rpx;
    .icon-yonghu {
      margin-right: 15rpx;
      color: #fff;
      background-color: $defaultColor;
      border-radius: 50%;
    }
  }
  .icon-sandian {
    font-size: 33rpx;
  }
  .add-button {
    width: 110rpx;
    height: 40rpx;
    padding: 0;
    line-height: 40rpx;
    color: $defaultColor;
    font-size: 22rpx;
    background-color: transparent;
    border: 1rpx solid $defaultColor;
    border-radius: 40rpx;
    .icon-jia {
      font-size: 20rpx;
    }
    &:active {
      color: #fff;
      background-color: $defaultColor;
      border: none;
    }
  }
}
</style>
