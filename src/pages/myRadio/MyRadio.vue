<template>
  <view class="my-radio">
    <page-nav
      :title="'我的电台'"
      :background="'#dd001b'"
      defaultShow
    />
    <view class="container" :style="[{display: show ? 'block' : 'none'}]">
      <loading :height="4.58" :style="[{display: loading ? 'flex' : 'none'}]"/>
      <view class="con" :style="[{display: !loading ? 'block' : 'none'}]">
        <text class="title">我订阅的电台<text class="number">({{count}})</text></text>
        <view class="radio-for on-touch" v-for="(item, index) in data" :key="index">
          <view class="img-info">
            <image :src="item.picUrl + '?param=100y100'" alt />
          </view>
          <view class="info">
            <text class="name van-ellipsis">{{ item.name }}</text>
            <text class="artist van-ellipsis">by {{item.dj.nickname}}</text>
            <text class="text van-ellipsis">{{item.lastProgramName}}</text>
          </view>
          <view class="radio-compile">
            <text class="iconfont icon-sandian"></text>
          </view>
        </view>
      </view>
    </view>
    <view class="empty" :style="[{display: !show ? 'flex' : 'none'}]">
      <text class="iconfont icon-kong"></text>
      <text>暂无内容</text>
    </view>
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import Loading from '@/components/Loading'
import { djSublist } from '@/api/apis'
export default {
  name: 'MyRadio',
  data () {
    return {
      loading: true,
      data: [],
      count: 0,
      show: true
    }
  },
  onLoad () {
    this.getDj()
  },
  onShow () {
    this.show = true
  },
  methods: {
    getDj () {
      djSublist()
        .then(data => {
          if (data.count === 0) {
            this.show = false
          } else {
            this.data = data.djRadios
            this.count = data.count
            this.$nextTick(() => {
              this.loading = false
            })
          }
        })
    }
  },
  components: {
    PageNav,
    Loading
  }
}
</script>
<style lang='scss' scoped>
.my-radio {
  height: 100vh;
  padding-top: $height;
  box-sizing: border-box;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .con {
    .title {
      display: block;
      margin: 20rpx 0 20rpx 25rpx;
      font-size: 35rpx;
      color: black;
      .number {
        font-size: 28rpx;
        color: rgb(187, 184, 184);
      }
    }
  }
  .radio-for {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 30rpx;
    .img-info {
      width: 150rpx;
      height: 150rpx;
      image {
        width: 150rpx;
        height: 150rpx;
        border-radius: 10rpx;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      width: 420rpx;
      padding: 0 15rpx;
      .name {
        color: black;
        font-size: 30rpx;
      }
      .artist, .text {
        padding-top: 10rpx;
        font-size: 24rpx;
        color: #aaa;
      }
    }
  }
}
</style>
