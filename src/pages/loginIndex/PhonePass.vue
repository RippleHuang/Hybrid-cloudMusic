<template>
  <view class="phone-pass">
    <PageNav
      :title="'手机号登录'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <view class="phone-login">
      <view class="phone-con">
        <input
        class="phone-num"
        type="password"
        placeholder="请输入密码"
        v-model="phonePass"
        >
        <text class="forget-link" @tap="goForget">忘记密码?</text>
      </view>
      <button class="next" round @tap="nextLogin">{{text}}</button>
    </view>
  </view>
</template>
<script>
import { phoneLogin, userDetail, loginStatus } from '@/api/apis'
import { mapMutations } from 'vuex'
import PageNav from '@/components/PageNav'
export default {
  name: 'PhonePass',
  data () {
    return {
      phonePass: '',
      text: '登录',
      phone: uni.getStorageSync('phoneNumber')
    }
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    goForget () {
      uni.navigateTo({
        url: './ForgetPass?path=phonepass',
        animationType: 'pop-in',
        animationDuration: 200
      })
    },
    // 登录
    nextLogin () {
      if (this.phonePass === '') {
       this.toast('请输入密码')
      } else {
        // 修改按钮text
        this.text = '登录中...'
        this.passVerity(this.phone, this.phonePass)
      }
    },
    ...mapMutations([
      'LOGIN_STATE',
      'SET_LEVEL',
      'ACCOUNT_UID',
      'NICK_NAME',
      'AVATAR_URL',
      'REFRESH'
    ]),
    // 密码验证
    passVerity (phone, pass) {
      phoneLogin(phone, pass)
        .then(data => {
          // code 200密码正确,502密码错误
          if (data.code === 200) {
            // 得到用户数据
            // 修改按钮text
            this.text = '登录'
            // 存取用户信息
            const accountInfo = data.profile
            this.AVATAR_URL(accountInfo.avatarUrl)
            this.NICK_NAME(accountInfo.nickname)
            this.ACCOUNT_UID(accountInfo.userId)
            // 存储token
            const _this = this
            uni.setStorage({
              key: 'cookie',
              data: data.cookie,
              success: function () {
                _this.getLoginState(accountInfo.userId)
              }
            })
          } else {
            // 修改按钮text
            this.text = '登录'
            this.toast('密码错误')
          }
        })
        .catch(() => {
          this.toast('登录失败,请稍后尝试')
        })
    },
    // 获得登录状态
    getLoginState (id) {
      loginStatus()
        .then(() => {
          // 修改状态为 true
          this.LOGIN_STATE(true)
          this.toast('登录成功')
          this.skipFind(id)
        })
    },
    // 跳转find页面
    skipFind (id) {
      userDetail(id)
        .then(data => {
          // 存储lv信息
          this.SET_LEVEL(data.level)
          // 刷新
          this.REFRESH()
          // 跳转到主页
          uni.navigateTo({
            url: '../index/index',
            animationType: 'pop-in',
            animationDuration: 200
          })
        })
    }
  },
  components: {
    PageNav
  }
}
</script>
<style lang='scss' scoped>
.forget-link {
  position: absolute;
  right: 0;
  bottom: 22rpx;
  font-size: 24rpx;
  color: rgb(77, 164, 235);
}
</style>
