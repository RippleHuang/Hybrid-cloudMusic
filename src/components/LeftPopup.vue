<template>
  <scroll-view scroll-y class="popup-container">
    <!-- 头部 -->
    <view class="header">
      <view class="mask"></view>
      <!-- 头部登录,显示登录 -->
      <popup-top :visible="visible" />
      <!-- 头部卡片 -->
      <view class="card">
        <view class="left">
          <text>开通黑胶VIP</text>
          <text>新客仅5元</text>
        </view>
        <view class="right">
          <text>享超12项豪华特权</text>
          <text class="iconfont icon-gudianyinle"></text>
        </view>
      </view>
      <view class="header-icons">
        <view class="icon-list on-touch" v-for="(item, index) in PopupTopIcons" :key="index" @tap="no">
          <text :class="item.icon"></text>
          <text class="icon-name-top">{{item.text}}</text>
        </view>
      </view>
    </view>
    <!-- 图标部分 -->
    <view class="shop">
      <view class="icons-list">
        <view
          v-for="(item, index) in PopupShopIcons"
          :key="index"
          class="list-item on-touch"
          @tap="forEvent(item.event)"
        >
          <view class="content">
            <text :class="item.icon" class="item-icon"></text>
            <text class="item-text">{{item.text}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="app">
      <view class="icons-list">
        <view
          v-for="(item, index) in PopupAppIcons"
          :key="index"
          class="list-item on-touch"
          @tap="forEvent(item.event)"
        >
          <view class="content">
            <text :class="item.icon" class="item-icon"></text>
            <text class="item-text">{{item.text}}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部设置 -->
    <!-- 循环绑定事件 -->
    <view class="bottom">
      <view class="icons on-touch"
        v-for="(item, index) in PopupBottomIcons"
        :key="index"
        @tap="forEvent(item.event)"
      >
        <text :class="item.icon"></text>
        <text class="icon-name">{{item.text}}</text>
      </view>
    </view>
    <u-modal
      v-model="showModel"
      show-cancel-button
      content="确认退出当前账号？"
      @cancel="showDialog = false"
      @confirm="loginOut"
    >
    </u-modal>
  </scroll-view>
</template>
<script>
import { PopupTopIcons, PopupShopIcons, PopupAppIcons, PopupBottomIcons } from '@/common/icons'
import PopupTop from '@/components/PopupTop'
import { logout } from '@/api/apis'
import { mapGetters } from 'vuex'
export default {
  name: 'LeftPopup',
  props: {
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      showModel: false,
      PopupTopIcons: [],
      PopupShopIcons: [],
      PopupAppIcons: [],
      PopupBottomIcons: []
    }
  },
  mounted () {
    this.PopupTopIcons = PopupTopIcons()
    this.PopupShopIcons = PopupShopIcons()
    this.PopupAppIcons = PopupAppIcons()
    this.PopupBottomIcons = PopupBottomIcons()
  },
  computed: {
    ...mapGetters(['nickName'])
  },
  methods: {
    forEvent (event) {
      this[event]()
    },
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    // 循环出来的事件
    no () {
      this.toast('登录,退出,签到,个人信息可用,其他功能尚未实装')
    },
    // 循环出来的事件
    loginout () {
      if (this.$store.state.loginState) this.showModel = true
      else this.toast('您暂未登录')
    },
    loginOut () {
      logout()
        .then(data => {
          if (data.code === 200) {
            // 保存手机号,签到信息,搜索历史 其他清空
            const phone = uni.getStorageSync('phoneNumber')
            const signIn = uni.getStorageSync('signIn')
            const keywords = uni.getStorageSync('keywords')
            this.$store.commit('LOGIN_OUT')
            // 跳转到登录页,并显示体验按
            uni.setStorageSync('login', 'login')
            uni.navigateTo({
              url: '../loginIndex/LoginIndex',
              animationType: 'pop-in',
              animationDuration: 200
            })
            uni.setStorageSync('phoneNumber', phone)
            uni.setStorageSync('signIn', signIn)
            uni.setStorageSync('keywords', keywords)
          }
        })
    }
  },
  components: {
    PopupTop
  }
}
</script>
<style lang='scss' scoped>
$popupIcon: 38rpx;
$liHeight: 100rpx;
.popup-container {
  width: $width*0.8;
  height: 92vh;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  // 头部
  .header {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 650rpx;
    // 底部背景
    .mask {
      position: absolute;
      top: 0;
      z-index: -3;
      width: $width*0.8;
      height: 400rpx;
      background:  #f3f3f3;
    }
    // 头部卡片
    .card {
      display: flex;
      justify-content: space-between;
      width: $width*0.8*0.88;
      height: 140rpx;
      padding: 20rpx 0 20rpx 20rpx;
      box-sizing: border-box;
      background: linear-gradient(to right, #0c0c0c 0%, #444 100%);
      border-radius: 10rpx;
      color: #fff;
      box-shadow: 10rpx 10rpx 35rpx 10rpx rgba(0, 0, 0, .1);
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: .8;
        box-sizing: border-box;
        border-right: 1rpx solid rgba(255, 255, 255, .3);
        text:first-of-type {
          font-size: 28rpx;
          font-weight: bold;
          color:  #f3cdc4;
        }
        text:last-of-type {
          font-size: 24rpx;
          color:  rgba(255, 255, 255, .7);
        }
      }
      .right {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex: 1.5;
        text:first-of-type {
          font-size: 24rpx;
        }
        text:last-of-type {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 65rpx;
          height: 65rpx;
          border-radius: 50%;
          color: #f7ae9e;
          background-color: rgb(104, 102, 102);
          text {
            font-size: 34rpx;
          }
        }
      }
    }
    // 头部图标
    &-icons {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: $width*0.8*0.88;
      padding: 30rpx 0 50rpx;
      .icon-list {
        padding: 20rpx 1rpx 0;
        text-align: center;
        .iconfont {
          margin-bottom: 15rpx;
          color: red;
          font-size: 55rpx;
        }
        .icon-name-top {
          display: block;
          font-size: 22rpx;
        }
      }
    }
  }
  // 内容icon
  .icons-list {
    display: flex;
    flex-direction: column;
    .list-item {
      display: flex;
      justify-content: center;
      height: $liHeight;
      .content {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: $width*0.8*0.88;
        .item-icon {
          display: flex;
          align-items: center;
          flex: 1.2;
          height: 80rpx;
          font-size: $popupIcon;
        }
        .item-text {
          display: flex;
          align-items: center;
          flex: 8;
          height: 80rpx;
          font-size: 35rpx;
        }
      }
      &:first-of-type {
        .content {
          border-top: 1rpx solid rgba(0, 0, 0, .1);
        }
      }
    }
  }
  // 底部
  .bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: $liHeight;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    .icons:first-of-type {
      padding-left: 28rpx;
    }
    .icons {
      display: flex;
      justify-content: center;
      flex: 1;
      height: $liHeight;
      align-items: center;
      text {
        font-size: $popupIcon;
      }
      .icon-name {
        padding-left: 10rpx;
        font-size: 32rpx;
      }
    }
  }
}
</style>
