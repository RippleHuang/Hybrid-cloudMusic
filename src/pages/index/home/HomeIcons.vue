<template>
  <scroll-view scroll-x class="icons-group">
    <!-- compile 等价于 :compile="true" -->
    <icons
      v-for="(item, index) in HomeIcons"
      :icons="item"
      :key="index"
      :compile="index === 14"
      class="home-icon-list"
      @noAction="noAction"
    >
    </icons>
  </scroll-view>
</template>
<script>
import Icons from '@/components/Icons'
import { HomeIcons } from '@/common/icons'
export default {
  name: 'HomeIcons',
  data () {
    return {
      HomeIcons
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.HomeIcons = HomeIcons()
    },
    noAction () {
      uni.showToast({title:'该功能尚未实装,敬请期待', icon: 'none'})
    }
  },
  components: {
    Icons
  }
}
</script>
<style lang='scss' scoped>
.icons-group {
  width: $width;
  height: 160rpx;
  padding: 40rpx 0;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .home-icon-list {
    display: inline-flex;
    justify-content: center;
    width: 100rpx;
    margin-left: 52rpx;
    &:first-of-type {
      margin-left: 25rpx;
    }
    &:last-of-type {
      padding-right: 25rpx;
    }
  }
}
</style>
