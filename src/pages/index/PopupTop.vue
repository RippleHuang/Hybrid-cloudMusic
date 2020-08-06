<template>
  <view class="popup-top">
    <!-- 未登录 -->
    <view class="not-login" v-if="!loginState">
      <text>登录网易云音乐</text>
      <text>手机电脑多端同步，尽享海量高品质音乐</text>
      <button class="title-btn" plain @tap="toPass">立即登录</button>
    </view>
    <!-- 已登录 -->
    <view class="logining" v-if="loginState" @tap="$router.push(`/userInfo?accountUid=${accountUid}`)">
      <view class="left-con">
        <image class="account-bgi" :src="avatarUrl" alt />
        <view class="information">
          <text class="account-nickname">{{nickName}}</text>
          <text class="lv">Lv.{{level}}</text>
        </view>
      </view>
      <view class="right-btn">
        <!-- 防止冒泡 -->
        <button
          class="sign"
          plain
          @tap.stop="signInClick"
          :class="!signIn ? 'show-block' : ''"
        >
          <text class="iconfont icon-tubiaozhizuo-"></text>签到
        </button>
        <botton
          class="signin"
          plain
          :class="signIn ? 'show-block' : ''"
          @tap.stop="signInClick"
        >
          已签到
          <text class="iconfont icon-arrow-right"></text>
        </botton>
      </view>
    </view>
  </view>
</template>
<script>
import { mapGetters } from 'vuex'
import { signIn } from '@/api/apis'
import { format } from '@/common/date'
export default {
  name: 'PopupTop',
  props: {
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      // 默认未签到
      signIn: false
    }
  },
  computed: {
    ...mapGetters(['loginState', 'level', 'nickName', 'avatarUrl', 'accountUid'])
  },
  watch: {
    visible: {
      handler (val, oldV) {
        if (this.loginState) {
          if (val) this.getSign()
        }
      },
      immediate: true
    }
  },
  methods: {
    toPass () {
      // 默认有体验按钮
      this.$router.push({ path: '/login', query: { login: uni.getStorageSync('login') || 'login' } })
    },
    // 确定是否签到
    getSign () {
      const date = new Date()
      const nowTime = format(date).slice(0, 10) // 截取当前日期 yyyy.mm.dd
      // 把日期转化为数值 转化为数字
      const nowSign = +nowTime.split('.').join('')
      // 有本地记录
      if (uni.getStorageSync('signIn')) {
        const local = JSON.parse(uni.getStorageSync('signIn'))
        // 遍历数组中的对象
        var getAccountUid = []
        var getSignInNum = []
        local.forEach((val, index) => {
          getAccountUid[index] = val.accountUid
          getSignInNum[index] = val.signInNum
        })
        if (getAccountUid.includes(this.accountUid)) {
          // 通过位置找到对应的最后签到时间
          const lastSign = getSignInNum[getAccountUid.indexOf(this.accountUid)]
          this.signIn = !(nowSign > lastSign)
        } else { // 无则默认未签到
          this.signIn = false
        }
      } else { // 无则默认签到
        this.signIn = false
      }
    },
    // 用户信息页
    userInfo () {
      this.$router.push('/userInfo')
    },
    // 保存最后签到时间
    setSignIn () {
      const date = new Date()
      const nowTime = format(date).slice(0, 10) // 截取当前日期
      // 把日期转化为数值,uid 保存到localStorage
      const signInNum = +nowTime.split('.').join('')
      var newO = { signInNum, accountUid: this.accountUid }
      if (uni.getStorageSync('signIn')) {
        var arr = []
        // 得到存储值
        const oldA = JSON.parse(uni.getStorageSync('signIn'))
        oldA.forEach(val => {
          arr.push(val)
        })
        // 数组反转
        var sign = arr.concat([newO]).reverse()
        // 数组对象去重
        var result = []
        var obj = {}
        for (var text = 0; text < sign.length; text++) {
          if (!obj[sign[text].accountUid]) {
            result.push(sign[text])
            obj[sign[text].accountUid] = true
          }
        }
        uni.setStorageSync('signIn', JSON.stringify(result))
      } else {
        uni.setStorageSync('signIn', JSON.stringify([newO]))
      }
    },
    // 签到
    signInClick () {
      signIn()
        .then(() => {
          this.setSignIn()
          if (this.signIn) {
            this.$toast('今天已签到')
          } else {
            this.$toast('签到成功')
            this.signIn = true
          }
        })
        .catch(() => {
          this.setSignIn()
          this.signIn = true
          this.$toast('今天已签到')
        })
    }
  }
}
</script>
<style lang='scss' scoped>
.popup-top {
  display: flex;
  justify-content: center;
  width: $width*0.8;
  // 未登录内容
  .not-login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: $width*0.8*0.88;
    height: 360rpx;
    line-height: 50rpx;
    font-size: 24rpx;
    color: rgb(99, 97, 97);
    .title-btn {
      width: 220rpx;
      height: 60rpx;
      line-height: 55rpx;
      margin-top: 45rpx;
      font-size: 32rpx;
      color: rgb(112, 111, 111);
      background-color: #f3f3f3;
      border: 1px solid #dbdada;
      box-sizing: border-box;
      &:active {
        border: none;
        color: #fff;
        background-color: #e9e6e6;
      }
    }
  }
  // 已登录内容
  .logining {
    display: flex;
    justify-content: space-between;
    width: $width*0.8*0.88;
    height: 360rpx;
    padding: 100rpx 0 50rpx;
    box-sizing: border-box;
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
        flex-direction: row;
        align-items: flex-end;
        flex: 1;
        .account-nickname {
          font-size: 46rpx;
          letter-spacing: -1rpx;
        }
        .lv {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 70rpx;
          height: 38rpx;
          margin-left: 15rpx;
          color: rgb(121, 116, 116);
          font: {
            size: 20rpx;
            weight: bold;
            style: italic;
          }
          background-color: rgb(219, 216, 216);
          border-radius: 20rpx;
        }
      }
    }
    .right-btn {
      display: flex;
      align-items: flex-end;
      // 签到按钮
      .sign {
        display: none;
        width: 100rpx;
        height: 45rpx;
        line-height: 45rpx;
        text-align: center;
        font-size: 21rpx;
        color: #fff;
        border-radius: 40rpx;
        background-color: #dd001b;
        text {
          font-size: 20rpx;
        }
      }
      // 已签到按钮
      .signin {
        display: none;
        width: 130rpx;
        height: 48rpx;
        line-height: 48rpx;
        text-align: center;
        font-size: 20rpx;
        color: rgb(99, 97, 97);
        border: 1rpx solid rgba(0, 0, 0, .1);
        border-radius: 50rpx;
        &:active {
          border: none;
          color: #fff;
          background-color: rgba(0, 0, 0, .1);
        }
        text {
          font-size: 20rpx;
        }
      }
    }
  }
}
</style>
