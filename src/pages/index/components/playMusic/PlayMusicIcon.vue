<template>
  <div class="music-icon">
    <text
      id="heart"
      class="iconfont"
      @tap="changeLike(audioIngSong.id)"
      :class="[{'icon-xindong2': !isLike, 'icon-xindongliang':isLike}]"
    >
    </text>
    <text class="iconfont icon-xiazai" @tap="unfinished"></text>
    <text class="iconfont icon-cailing" @tap="unfinished"></text>
    <text class="iconfont icon-xinxi" @tap="unfinished"></text>
    <text class="iconfont icon-gedanxinxi_" @tap="changeTranslate"></text>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { likeMusic } from 'api/apis'
export default {
  name: 'PlayMusicIcon',
  props: {
    isLike: {
      type: Boolean
    },
    translate: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['audioIngSong', 'loginState'])
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    // 取消 添加 喜欢歌曲
    changeLike (id) {
      if (this.loginState) {
        likeMusic(id, !this.isLike)
          .then(() => {
            const message = !this.isLike ? '已添加喜欢列表' : '已取消喜欢'
            this.toast(message)
            this.$emit('update:isLike', !this.isLike)
          })
      } else this.toast('需要登录')
    },
    unfinished () {
      this.toast('心动与翻译可用,其他未实装,敬请期待')
    },
    changeTranslate () {
      this.$emit('update:translate', !this.translate)
      if (!this.translate) {
        this.toast('已翻译')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.music-icon {
  display: flex;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 40rpx;
  text {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 45rpx;
    color: white;
  }
  .icon-xindongliang {
    color: $defaultColor;
  }
}
</style>
