<template>
  <view class="item-list">
    <view
      v-for="(item, index) in icons"
      :key="index"
      class="home-apply-item on-touch"
      @tap="forEvent(item.event)"
    >
      <text
      :class="item.icon"
      class="item-icon"></text>
      <view class="home-apply-content">
        <text class="item-text">{{item.text}}</text>
        <text class="item-num" v-if="!height">({{item.num}})</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'HomeFor',
  props: {
    icons: {
      type: Array
    },
    height: {
      type: Number
    },
    uid: {
      type: Number
    },
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    forEvent (event) {
      this[event]()
    },
    // 循环出来的事件
    no () {
      this.toast('创建新歌单,编辑歌单信息,删除可用,其他功能尚未实装')
    },
    noAction () {
      this.toast('我的电台,我的收藏,其他功能尚未实装')
    },
    createList () {
      this.$emit('createSongList')
    },
    compile () {
      const { uid, title, description } = this
      const des = description != null ? description : ''
      uni.navigateTo({
				url: `/otherPages/compileSongList/CompileSongList?id=${uid}&title=${title}&description=${des}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    delete () {
      this.$emit('deleteSongList')
    },
    goMyRadio () {
      if (this.$store.state.loginState) {
        uni.navigateTo({
          url: '/otherPages/myRadio/MyRadio',
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else {
        this.toast('需要登录')
      }
    },
    goMyFavorite () {
      if (this.$store.state.loginState) {
        uni.navigateTo({
          url: '/otherPages/myFavorite/MyFavorite',
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else {
        this.toast('需要登录')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.item-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .home-apply-item {
    display: flex;
    height: 110rpx;
    .item-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1.5;
      font-size: 50rpx;
      font-weight: 300;
    }
    // 最后一个无底边框
    &:last-of-type {
      .home-apply-content {
        border: none;
      }
    }
    .home-apply-content {
      display: flex;
      align-items: center;
      flex: 6;
      height: 110rpx;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      .item-text {
        font-size: 30rpx;
      }
      .item-num {
        margin-left: 10rpx;
        color: rgba(0, 0, 0, .4);
      }
    }
  }
}
</style>
