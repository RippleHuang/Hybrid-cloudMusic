<template>
  <view class="login-phone">
    <PageNav
      :title="'手机号登录'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <view class="phone-login">
      <text class="info">未注册手机号登录后将自动创建账号</text>
      <view class="phone-con">
        <text class="phone-left" :style="[{color}]">+86</text>
        <input
        class="phone-num"
        type="text"
        placeholder="请输入手机号"
        maxlength="11"
        v-model="phoneNumber"
        @input="inputNumber"
        >
        <text @tap="clear" class="iconfont icon-chahao" :style="[{display: phoneNumber ? 'block' : 'none'}]"></text>
      </view>
      <button class="next" round @tap="nextPass">下一步</button>
    </view>
  </view>
</template>
<script>
import { phoneRegistered, sendVerify } from '@/api/apis'
import PageNav from '@/components/PageNav'
export default {
  name: 'LoginPhone',
  data () {
    return {
      phoneNumber: '',
      color: ''
    }
  },
  onLoad () {
    this.getLocalStorage()
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    clear () {
      this.phoneNumber = ''
      // 并不在input事件中,清除时需要把左侧字体颜色改变
      this.color = 'rgb(158, 151, 152)'
    },
    inputNumber () {
      // 只允许输入数字
      this.phoneNumber = this.phoneNumber.replace(/[^\d]/g, '')
      /* 左侧字体颜色改变 */
      if (this.phoneNumber === '') {
        this.color = 'rgb(158, 151, 152)'
      } else {
        this.color = 'black'
      }
    },
    // 验证账号是否存在并跳转相应页面
    verification (phone) {
      phoneRegistered(phone)
        .then(data => {
          // localStorage 存储
          uni.setStorageSync('phoneNumber', phone)
          // exist为1则有账号,-1为无账号
          if (data.exist === 1) {
            uni.navigateTo({
              url: './PhonePass',
              animationType: 'pop-in',
              animationDuration: 200
            })
          } else if (data.exist === -1) {
            this.sendVerifyNum(phone)
            uni.navigateTo({
              url: './PhoneVerify?path=phone',
              animationType: 'pop-in',
              animationDuration: 200
            })
          }
        })
        .catch(() => {
          this.toast('请求失败,请稍后尝试')
        })
    },
    nextPass () {
      /* toast */
      /* 手机号验证 */
      const exp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (this.phoneNumber === '') {
        this.toast('请输入手机号')
      } else if (exp.test(this.phoneNumber)) {
        this.verification(this.phoneNumber)
      } else {
        this.toast('请输入正确的手机号')
      }
    },
    // 发送验证码
    sendVerifyNum (phone) {
      sendVerify(phone)
        .then(data => {
          if (data.code === 200) {
            this.toast('发送成功')
          } else if (data.code === 400) {
            this.toast('每个手机号一天只能发5条验证码')
          }
        })
        .catch(() => {
          this.toast('请求失败,请稍后尝试')
        })
    },
    // 获取localStorage 中存储的手机号
    getLocalStorage () {
      const phone = uni.getStorageSync('phoneNumber')
      if (phone) {
        this.phoneNumber = phone
        this.color = 'black'
      }
    }
  },
  components: {
    PageNav
  }
}
</script>
<style lang='scss' scoped>
.phone-login {
  .info {
    color: rgb(158, 151, 152);
    font-size: 28rpx;
  }
  .phone-left {
    margin-top: 35rpx;
    font-size: 36rpx;
    color: rgb(158, 151, 152);
  }
}
</style>
