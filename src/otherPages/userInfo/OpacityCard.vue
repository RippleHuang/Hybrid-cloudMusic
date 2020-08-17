<template>
  <view class="opacity-card">
    <page-nav
      :title="nickName"
      :isFixed="isFixed"
      :background="`url(${coverImgUrl})`"
      :height="'60px'"
      share
    />
    <view class="body">
      <view class="left-con">
        <image class="account-bgi" :style="[{display: loading ? 'block' : 'none'}]" :src="avatarUrl + '?param=80y80'" />
        <view class="information">
          <text class="account-nickname">{{nickName}}</text>
          <view class="relation">
            <text>关注 {{newFollows}}</text>
            <text class="line">|</text>
            <text>粉丝 {{followeds}}</text>
          </view>
          <view class="info">
            <view class="age"
              :style="[{ background: gender === 1 ? 'rgba(104, 125, 194, 0.8)':'rgba(255, 119, 165, 0.8)'}]"
              v-if="birthday > 0"
            >
              <text class="iconfont icon-nan" style="color: #6eccff;" v-if="gender === 1"></text>
              <text class="iconfont icon-nv" style="color: #fd79a8;" v-else></text>
              {{ birthday | filterAge }}后
            </view>
            <text class="lv">Lv.{{level}}</text>
          </view>
        </view>
      </view>
      <view class="right-btn" v-if="otherName === nickName">
        <button class="compile" @tap.stop="noAchieve">编辑</button>
        <button class="changebgc" @tap.stop="noAchieve">更换背景</button>
      </view>
      <view class="right-btn" v-else>
        <button class="compile" style="background: #dd001b;" @tap.stop="noAchieve">
          <text class="iconfont icon-jia"></text> 关注
        </button>
        <button class="changebgc" @tap.stop="noAchieve">
          <text class="iconfont icon-email"></text> 发私信
        </button>
      </view>
    </view>
  </view>
</template>
<script>
import { filterAge } from '@/common/filters'
import PageNav from '@/components/PageNav'
export default {
  name: 'OpacityCard',
  props: {
    isFixed: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    followeds: {
      type: Number
    },
    newFollows: {
      type: Number
    },
    gender: {
      type: Number
    },
    birthday: {
      type: Number
    },
    coverImgUrl: {
      type: String
    },
    avatarUrl: {
      type: String
    },
    level: {
      type: Number
    },
    nickName: {
      type: String
    }
  },
	data () {
		return {
			otherName: ''
		}
	},
	created () {
		this.otherName = this.$store.state.nickName
	},
  methods: {
    rollback () {
      uni.navigateBack({
        delta: 1,
        animationType: 'pop-out',
        animationDuration: 200
      })
    },
    noAchieve () {
      uni.showToast({title:'此功能尚未开通, 敬请期待', icon: 'none'})
    }
  },
  filters: {
    filterAge
  },
  components: {
    PageNav
  }
}
</script>
<style lang='scss' scoped>
.opacity-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
  .body {
    display: flex;
    justify-content: space-between;
    width: $width*0.928;
    margin-top: 60rpx;
    .left-con {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 2;
      // 用户头像
      .account-bgi {
        width: 135rpx;
        height: 135rpx;
        border-radius: 50%;
      }
      // 用户信息
      .information {
        display: flex;
        flex-direction: column;
        flex: 1;
        color: #fff;
        .account-nickname {
          margin: 30rpx 0;
          font-size: 38rpx;
          letter-spacing: -1rpx;
        }
        .relation {
          padding-bottom: 30rpx;
          .line {
            font-size: 24rpx;
            margin: 0 20rpx;
            color: rgb(177, 169, 169);
          }
        }
        .info {
          display: flex;
          flex-direction: row;
          .age {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10rpx;
            width: 130rpx;
            height: 42rpx;
            font-size: 22rpx;
            border-radius: 20rpx;
            text {
              font-size: 22rpx;
              margin-right: 10rpx;
            }
          }
          .lv {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100rpx;
            height: 42rpx;
            font: {
              size: 22rpx;
              weight: bold;
              style: italic;
            }
            background-color: rgba(194, 185, 185, 0.7);
            border-radius: 20rpx;
          }
        }
      }
    }
    .right-btn {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .compile {
        @extend .changebgc;
        margin-right: 10rpx;
      }
      .changebgc {
        color: #fff;
        font-size: 22rpx;
        box-sizing: border-box;
        background-color: rgb(214, 202, 202, .6);
        border-radius: 30rpx;
        border: none;
        &:active {
           background-color: rgba(233, 227, 227, 0.8);
        }
        text {
          font-size: 20rpx;
        }
      }
    }
  }
}
</style>
