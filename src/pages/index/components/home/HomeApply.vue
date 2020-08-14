<template>
  <view class="home-apply-container">
    <home-for :icons="homeAppIcons"/>
  </view>
</template>
<script>
import { HomeAppIcons } from '@/common/icons'
import HomeFor from '@/components/HomeFor'
export default {
  name: 'HomeApply',
  props: {
    dj: {
      type: Number
    },
    favorite: {
      type: Number
    }
  },
  data () {
    return {
      homeAppIcons: []
    }
  },
  watch: {
    dj (val, oldV) {
      if (val) this.homeAppIcons[3].num = val
    },
    favorite (val, oldV) {
      if (val) this.homeAppIcons[4].num = val
    },
    '$store.state.loginState': {
      handler (val, oldV) {
        if (!val) {
          this.homeAppIcons[3].num = 0
          this.homeAppIcons[4].num = 0
        }
      }
    }
  },
  created () {
    this.homeAppIcons = HomeAppIcons()
  },
  components: {
    HomeFor
  }
}
</script>
<style lang='scss' scoped>
.home-apply-container {
  border-top: 1px solid #eee;
  border-bottom: 18rpx solid #eee;
}
</style>
