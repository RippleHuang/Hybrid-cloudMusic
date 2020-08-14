<template>
  <view class="music-button">
    <text class="iconfont" :class="[modeClass]" @tap="changeMode"></text>
    <text class="iconfont icon-xiangyiqu" @tap="prev"></text>
    <text class="iconfont" @tap="play" :class="[{ 'icon-bofang1': !playState, 'icon-zanting': playState }]"></text>
    <text class="iconfont icon-shangyiqu" @tap="next"></text>
    <text class="iconfont icon-icon-test" @tap="showAudioList"></text>
  </view>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MusicButton',
  props: {
    mode: {
      type: Number
    }
  },
  computed: {
    ...mapGetters(['playState']),
    modeClass: function () {
      if (this.mode === 0) {
        return 'icon--lbxh'
      }
      if (this.mode === 1) {
        return 'icon-loop'
      } else {
        return 'icon-suijibofang-wangyiicon'
      }
    }
  },
  methods: {
    play () {
      this.$emit('play')
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
    },
    changeMode () {
      this.$emit('changeMode')
    },
    showAudioList () {
      this.$emit('showAudioList')
    }
  }
}
</script>
<style lang='scss' scoped>
.music-button {
  display: flex;
  justify-content: space-between;
  height: $height;
  padding: 0 40rpx 40rpx;
  text {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 45rpx;
    color: white;
  }
  text:nth-of-type(3) {
    font-size: 70rpx;
  }
}
</style>
