<template>
  <view class="login-mask" @tap="goBack">
    <view class="logo">
      <view class="circle"></view>
      <view class="circle"></view>
      <text class="iconfont icon-wangyiyunyinle1"></text>
    </view>
    <view class="login">
      <button class="login-btn" round @tap.stop="phoneLogin">手机号登录</button>
      <button
        v-if="login === 'login'"
        class="experience-btn"
        round
        @tap.stop="noLogin"
      >
      立即体验
      </button>
      <view class="login-icons">
        <text @tap.stop="unfinished"><i class="iconfont icon-weixin"></i></text>
        <text @tap.stop="unfinished"><i class="iconfont icon-qq"></i></text>
        <text @tap.stop="unfinished"><i class="iconfont icon-weibo"></i></text>
        <text @tap.stop="unfinished"><i class="iconfont icon-wangyi"></i></text>
      </view>
      <view @tap.stop class="text" :style="[{animationPlayState: shake ? 'running' : 'paused'}]">
        <u-checkbox
          v-model="checked"
          size="28"
          icon-size="24" 
          label-size="22"
          shape="square"
          active-color="rgba(255, 255, 255, 0.2)"
        >
        <text class="checked-label">同意</text>
        </u-checkbox>
        <text>《用户协议》《隐私政策》《儿童隐私政策》</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'LoginIndex',
  data () {
    return {
      checked: false,
      timer: '',
			login: '',
			shake: false
    }
  },
  onLoad () {
		this.login = uni.getStorageSync('login')
		this.toast('点击周围空白处即可回到首页')
  },
  methods: {
		toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    hint () {
      this.toast('请先勾选同意《用户协议》《隐私政策》《儿童隐私政策》')
      // 抖动
      this.shake = true
      if (this.timer) clearTimeout(this.timer) 
      this.timer = setTimeout(() =>{
        this.shake = false
			}, 500)
    },
    goBack () {
			uni.navigateTo({
				url: '../index/index',
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    phoneLogin () {
      if (!this.checked) {
        this.hint()
      } else {
        /* 跳转到手机登录界面 */
				uni.navigateTo({
					url: './LoginPhone',
					animationType: 'pop-in',
					animationDuration: 200
				})
      }
    },
    noLogin () {
      if (!this.checked) {
        this.hint()
      } else {
        /* 跳转到find首页 */
        this.goBack()
        // 点击一次后隐藏
        uni.setStorageSync('login', 'nologin')
      }
    },
    unfinished () {
      if (!this.checked) {
        this.hint()
      } else {
        this.toast('只支持手机号登录,其他尚未实装,敬请期待！')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.login-mask {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, #dd001b, rgb(255, 44, 44));
  height: 100vh;
  padding: 250rpx 30rpx 0;
  box-sizing: border-box;
  .logo {
    position: relative;
    width: 180rpx;
    height: 180rpx;
    line-height: 180rpx;
    text-align: center;
    color: #fff;
    background-color: #fc0420;
    border-radius: 50%;
    /* 波纹效果 */
    .circle {
      position: absolute;
      width: 180rpx;
      height: 180rpx;
      border: 1rpx solid rgb(243, 121, 121);
      border-radius: 50%;
      box-sizing: border-box;
      opacity: 0;
    }
    .circle:first-child {
      animation: circle 4s infinite;
    }
    .circle:nth-child(2) {
      animation: circle 4s 1.5s infinite;
    }
    text {
      font-size: 110rpx;
    }
  }
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 30rpx;
    .login-btn {
      width: 72vw;
      height: 100rpx;
      line-height: 100rpx;
      color: #e60721;
      font-size: 35rpx;
      border-radius: 50rpx;
      &:active {
        background-color: rgba(255, 255, 255, .8);
        border: none;
      }
    }
    .experience-btn {
      width: 72vw;
      height: 100rpx;
      line-height: 100rpx;
      margin-top: 40rpx;
      color: #fff;
      font-size: 35rpx;
      border-radius: 50rpx;
      background-color: transparent;
      border: 1rpx solid rgba(255, 255, 255, .4);
      &:active {
        background-color: rgba(255, 255, 255, .3);
        border: none;
      }
    }
    .login-icons {
      display: flex;
      justify-content: space-between;
      width: 68vw;
      padding: 60rpx 10rpx;
      text {
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        color: #fff;
        background-color: transparent;
        border: .01rpx solid rgba(255, 255, 255, .3);
        border-radius: 50%;
        box-sizing: border-box;
        &:active {
          background-color: rgba(255, 255, 255, .3);
          border: 1rpx solid transparent;
        }
        text {
          font-size: 42rpx;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 20rpx;
      animation: shake 0.15s ease-in-out infinite;
      .checked-label {
        color: #fff;
      }
      text {
        color: #fff;
      }
    }
  }
}
@keyframes circle{
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(3.5);
  }
}
@keyframes shake{
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(10rpx);
  }
  50% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(-10rpx);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
