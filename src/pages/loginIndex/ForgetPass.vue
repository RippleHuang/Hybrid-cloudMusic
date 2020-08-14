<template>
  <view class="forget-pass">
    <PageNav
      :title="path === 'phonepass' ? '忘记密码':'手机号注册'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <view class="phone-login">
      <view class="phone-con">
        <input
        class="phone-num"
        type="password"
        placeholder="设置登录密码,不少于6位"
        v-model="forgetPhonePass"
        >
        <text @tap="clear" class="iconfont icon-chahao" :style="[{display: forgetPhonePass ? 'block' : 'none'}]"></text>
      </view>
      <button class="next" round @tap="forgetNext">下一步</button>
    </view>
  </view>
</template>
<script>
import { sendVerify } from '@/api/apis'
import PageNav from '@/components/PageNav'
export default {
  name: 'ForgetPass',
  data () {
    return {
      forgetPhonePass: '',
      path: '',
      phone: uni.getStorageSync('phoneNumber')
    }
  },
  // 进入前判定从哪里进入
  onLoad (option) {
    this.path = option.path
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    clear () {
      this.forgetPhonePass = ''
    },
    async forgetNext () {
      /* 不少于6位除了回车和换行的字符 */
      const exp = /[^.]{6,}$/
      if (this.forgetPhonePass === '') {
        this.toast('请输入密码')
      } else if (exp.test(this.forgetPhonePass)) {
        this.pushPage()
      } else {
        this.toast('请输入不少于6位的密码')
      }
    },
    // 跳转到相应页面
    pushPage () {
      // 加密密码保存到 sessionStorage
      const cipherText = this.$encrypt(this.forgetPhonePass, 'PhonePassword')
      uni.setStorageSync('cipherText', cipherText)
      if (this.path === 'phonepass') {
        this.sendVerifyNum(this.phone)
      } else if (this.path === 'phoneverify') {
        // 跳转到昵称页面
        uni.navigateTo({
          url: './NickName',
          animationType: 'pop-in',
          animationDuration: 200
        })
      }
    },
    // 发送验证码
    sendVerifyNum (phone) {
      sendVerify(phone)
        .then(data => {
          if (data.code === 200) {
            this.toast('发送成功')
            // 跳转到验证码页面
            uni.navigateTo({
              url: './PhoneVerify?path=forgetpass',
              animationType: 'pop-in',
              animationDuration: 200
            })
          } else if (data.code === 400) {
            this.toast('每个手机号一天只能发5条验证码')
          }
        })
        .catch(() => {
          this.toast('请求失败,请稍后尝试')
        })
    }
  },
  components: {
    PageNav
  }
}
</script>
<style lang='scss' scoped>

</style>
