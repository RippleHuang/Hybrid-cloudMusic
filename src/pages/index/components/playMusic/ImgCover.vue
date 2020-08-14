<template>
  <view @tap="goLyric" class="img-cover" v-if="imgUrl">
    <image
      class="img-circle"
      :src="imgUrl + '?param=300y300'"
      :style="[{'animation-play-state': playState ? 'running' : 'paused'}]"
    />
  </view>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ImgCover',
  props: {
    imgUrl: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['playState'])
  },
  methods: {
    goLyric () {
      this.$emit('goLyric')
    }
  },
}
</script>
<style lang='scss' scoped>
.img-cover {
  box-sizing: border-box;
  width: 530rpx;
  height: 530rpx;
  border-radius: 50%;
  background-color: black;
  .img-circle {
    width: 500rpx;
    height: 500rpx;
    border-radius: 50%;
    border: 15rpx solid rgb(74, 160, 187, .6);
    animation: rotating 22s linear infinite;
    transition: all .5s ease-out;
  }
}
// 图片旋转
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
