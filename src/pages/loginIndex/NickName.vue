<template>
  <view class="nick-name">
    <PageNav
      :title="'给自己取一个昵称'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <view class="phone-login">
      <view class="logo">
        <image src="../../static/img/hi.jpg" alt>
        <text>希望大家怎么称呼您呢？</text>
      </view>
      <view class="phone-con">
        <input
          class="phone-num"
          type="text"
          placeholder="请输入昵称"
          v-model="nickName"
          required="required"
        >
        <text @tap="clear" class="iconfont icon-chahao" :style="[{display: nickName ? 'block' : 'none'}]"></text>
      </view>
      <button class="next" round @tap="register">开启云音乐</button>
    </view>
  </view>
</template>
<script>
import { register } from '@/api/apis'
import PageNav from '@/components/PageNav'
export default {
  name: 'NickName',
  data () {
    return {
      nickName: ''
    }
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    clear () {
      this.nickName = ''
    },
    register () {
      /* 不少于2个汉字或4个字符 */
      const exp = /([\u4e00-\u9fa5]{2,})|[A-Za-z0-9]{4,}/
      if (this.nickName === '') {
        this.toast('请输入昵称')
      } else if (exp.test(this.nickName)) {
        // 获取数据
        const phone = uni.getStorageSync('phoneNumber')
        const code = uni.getStorageSync('code')
        // 得到加密密码
        const cipherText = uni.getStorageSync('cipherText')
        // Decrypt 解密
        const pass = this.$decrypt(cipherText, 'PhonePassword')
        this.registerPass(phone, pass, code, this.nickName)
      } else {
        this.toast('请输入不少于2个汉字或4个字符的昵称')
      }
    },
    // 注册用户
    registerPass (phone, password, captcha, nickname) {
      register(phone, password, captcha, nickname)
        .then(data => {
          this.toast('注册成功')
          // 跳转到登录页
          uni.navigateTo({
            url: './LoginIndex',
            animationType: 'pop-in',
            animationDuration: 200
          })
        })
        .catch(err => {
          // 505 昵称已存在
          if (err.response.status === 505) {
            this.toast('昵称已存在')
            this.nickName = ''
          } else if (err.response.status === 503) {
            this.toast('验证码已过期')
          } else {
            this.toast('注册失败,请稍后尝试')
          }
        })
    }
  },
  components: {
    PageNav
  }
}
</script>
<style lang='scss' scoped>
.logo {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  img {
    width: 340rpx;
    height: 340rpx;
  }
  p {
    padding: 30rpx 0 0 20rpx;
    color: black;
    font-size: 32rpx;
  }
}
</style>
