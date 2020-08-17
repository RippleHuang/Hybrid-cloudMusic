<template>
  <view class="forget-pass">
    <PageNav
      :title="'手机号验证'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <view class="phone-verify">
      <text>验证码已发送至</text>
      <view class="info">
        <text class="phone">+86&nbsp;&nbsp;{{first}}****{{after}}</text>
        <text @click="sendPhoneVerify" :style="[{color}]" class="get-verify">{{title}}</text>
      </view>
      <view class="vcode" id='vertifycode'>
        <input type="tel" maxlength='4' class='code'
          v-model="code"
          @input="inputCode"
        >
        <view class="labels">
          <label class="label" for="code"
            v-for="(item, index) in 4"
            :key="index"
          >
          {{arrCode[index] ? arrCode[index] : ''}}
          </label>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { sendVerify, verify, register } from '@/api/apis'
import PageNav from '@/components/PageNav'
export default {
  name: 'PhoneVerify',
  props: {
    name: {
      type: String
    }
  },
  data () {
    return {
      code: '',
      first: '',
      after: '',
      title: '',
      timer: '',
      // 锁
      lock: false,
      path: '',
      phone: uni.getStorageSync('phoneNumber'),
      color: ''
    }
  },
  onLoad (option) {
    this.path = option.path
    // 进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timer)
    this.timer = null
    // 跳转这个页面默认已经发送了验证码
    this.sendButton()
    this.first = this.phone.slice(0, 3)
    this.after = this.phone.slice(7, 12)
  },
  computed: {
    arrCode: function () {
      return this.code.split('')
    }
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    // 发送验证码
    sendPhoneVerify () {
      if (this.lock) {
        sendVerify(this.phone)
          .then(data => {
            this.toast('已发送验证码')
          })
          .catch(err => {
            if (err.response.status === 400) {
              this.toast('每个手机号一天只能发5条验证码')
            } else {
              this.toast('发送失败,请稍后尝试')
            }
          })
        this.lock = false
        this.sendButton()
      } else {
        this.toast('已发送验证码,10分钟内有效')
      }
    },
    // 输入
    inputCode () {
      this.code = this.code.replace(/[^\d]/g, '') // 限制非数字
      if (this.code.length >= 4) {
        if (this.path === 'forgetpass') {
          // 得到加密密码
          const cipherText = uni.getStorageSync('cipherText')
          // Decrypt 解密,微信小程序不能使用
          // #ifndef MP
          const pass = this.$decrypt(cipherText, 'PhonePassword')
          // #endif
          // #ifdef MP
          const pass = unescape(cipherText)
          // #endif
          // 修改密码
          this.changePass(this.phone, pass, this.code)
        } else if (this.path === 'phone') {
          // 新用户跳转到输入密码页
          this.codeVerity()
        }
      }
    },
    // 修改密码
    changePass (phone, password, captcha, nickname) {
      register(phone, password, captcha, nickname)
        .then(data => {
          // 跳转到登录页
          const _this = this
          uni.navigateTo({
            url: './LoginIndex',
            animationType: 'pop-in',
            animationDuration: 200,
            success: function () {
              _this.toast('修改成功')
            }
          })
        })
        .catch(err => {
          if (err.response.status === 503) {
            this.toast('验证码错误')
          } else {
            this.toast('注册失败,请稍后尝试')
          }
        })
    },
    codeVerity () {
      // 验证验证码
      verify(this.phone, this.code)
        .then(data => {
          if (data.code === 200) {
            this.toast('验证码正确')
            // 保存code
            // 跳转到忘记密码页
            uni.setStorageSync('code', this.code)
            uni.navigateTo({
              url: './ForgetPass?path=phoneverify',
              animationType: 'pop-in',
              animationDuration: 200
            })
          } else {
            this.toast('验证码错误')
            this.code = ''
          }
        })
        .catch(() => {
          this.toast('请求失败,请稍后尝试')
        })
    },
    // 右边按钮
    sendButton () {
      if (!this.lock) {
        let second = 60
        this.timer = setInterval(() => {
          second--
          if (second >= 0) {
            this.title = `${second}s`
            this.color = 'rgb(184, 180, 180)'
          } else {
            clearInterval(this.timer)
            this.title = '重新获取'
            this.color = 'rgb(77, 164, 235)'
            this.lock = true
          }
        }, 1000)
      }
    }
  },
  components: {
    PageNav
  },
  onHide () {
    // 每次离开当前界面时，清除定时器
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>
<style lang='scss' scoped>
.phone-verify {
  padding: 160rpx 50px 0;
  box-sizing: border-box;
  span {
    color: black;
    font-size: 36rpx;
  }
  .info {
    display: flex;
    justify-content: space-between;
    padding: 50rpx 0 0;
    span {
      color: rgb(167, 163, 163);
      font-size: 32rpx;
    }
    .get-verify {
      font-size: 28rpx;
    }
  }
  // 验证码
  .vcode {
    position: relative;
    width: 80%;
    margin: 1rpx auto 0;
    padding: 0 40rpx;
    overflow: hidden;
    // 隐藏input
    .code {
      width: 100%;
      padding: 0;
      height: 40px;
      font-size: 35px;
      overflow: hidden;
      border: none;
      outline: none;
      opacity: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .labels {
      display: flex;
      height: 40px;
      justify-content: space-between;
      margin-top: -40px;
      -webkit-tap-highlight-color: transparent;// 解决ios点击灰色阴影的问题
      .label {
        height: 34px;
        width: 18%;
        color: #313131;
        font-size: 30px;
        text-align: center;
        padding-bottom: 4px;
        border-bottom: solid 2px #313131;
      }
    }
  }
}
</style>
