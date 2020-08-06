<template>
<view class="find-icon-content">
  <view class="find-icon-list">
    <icons
      v-for="(item, index) in findIcons" :key="index"
      :icons="item"
      @tap.native="forEvent(item.event)"
    />
  </view>
</view>
</template>
<script>
import Icons from '@/components/Icons'
import { FindIcons } from '@/common/icons'
import { personalFm } from '@/api/apis'
export default {
  name: 'FindIcons',
  data () {
    return {
      findIcons: []
    }
  },
  mounted () {
    this.findIcons = FindIcons()
  },
  methods: {
    forEvent (event) {
      this[event]()
    }
    // no () {
    //   this.$toast('该功能尚未完成,敬请期待')
    // },
    // goRecommend () {
    //   if (this.$store.state.loginState) {
    //     // this.$router.push('/recommend')
    //   } else {
    //     this.$toast('需要登录')
    //   }
    // },
    // moreSonglist () {
    //   // this.$router.push('/songlistsquare')
    // },
    // goRankingList () {
    //   // this.$router.push('/rankinglist')
    // },
    // goPersonalFm () {
    //   personalFm()
    //     .then(data => {
    //       const list = data.data
    //       this.$store.dispatch('startPlayAll', { list })
    //     })
    // }
  },
  components: {
    Icons
  }
}
</script>
<style lang="scss" scoped>
.find-icon-content {
  display: flex;
  justify-content: center;
  width: $width;
  padding-bottom: 30rpx;
  border-bottom: 1px solid #eee;
  .find-icon-list{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: $width*0.928;
    height: 180rpx;
  }
}
</style>
