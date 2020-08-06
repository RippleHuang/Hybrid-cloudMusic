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
  mounted () {
    this.homeAppIcons = HomeAppIcons()
  },
  activated () {
    this.homeAppIcons[3].num = this.dj
    this.homeAppIcons[4].num = this.favorite
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
