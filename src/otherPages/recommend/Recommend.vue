<template>
  <scroll-view scroll-y @scroll="songScroll" @scrolltolower="pullDown" class="recommend">
    <PageNav
      :title="'每日推荐'"
      :background="'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)'"
      :height="fixed ? '80px' : '60px'"
      :isFixed="fixed"
    />
    <view class="data-content">
      <view class="date">
        <text class="day">{{new Date().getDate()| supplement}}</text>
        <text class="month">/{{new Date().getMonth() + 1 | supplement}}</text>
      </view>
      <text class="title">今日推荐</text>
    </view>
    <pubcli-sticky
      show
      recommend
      :loading="loading"
      :songList="songList"
      :songListAll="songListAll"
      :stickyTop="'60px'"
      :newAndrecommed="'0 10px 0 13px'"
    />
  </scroll-view>
</template>
<script>
import PubcliSticky from '@/components/PubcliSticky'
import PageNav from '@/components/PageNav'
import { recSongs } from '@/api/apis'
export default {
  name: 'Recommend',
	data () {
		return {
      fixed: false,
      songList: [],
      songListAll: [],
      loading: true,
      sum: 0,
      load: false,
      finish: false
		}
	},
  onShow () {
    this.getRecSongs()
  },
  methods: {
    getRecSongs () {
      recSongs()
        .then(data => {
          this.songListAll = data.data.dailySongs
          this.division()
        })
    },
    division () {
      const result = []
      for (var i = 0; i < this.songListAll.length; i += 30) {
        result.push(this.songListAll.slice(i, i + 30))
      }
      if (!this.finish) this.songList.push(...result[this.sum])
      this.$nextTick(() => {
        this.loading = false
        // 加载状态结束
        this.load = false
      })
      // 数据全部加载完成
      if (this.songList.length >= this.songListAll.length) {
        this.finish = true
      }
    },
    pullDown () {
      this.sum++
      this.division()
    },
		songScroll (e) {
			if (e.detail.scrollTop >= 180) this.fixed = true
			else this.fixed = false
		}
  },
  filters: {
    supplement (nn) {
      nn = nn < 10 ? '0' + nn : nn
      return nn
    }
  },
  components: {
    PageNav,
    PubcliSticky
  }
}
</script>
<style lang='scss' scoped>
.recommend {
  height: 100vh;
  .data-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 560rpx;
    padding: 40rpx 20rpx 0;
    background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
    .date {
      .day {
        color: #fff;
        font-size: 52rpx;
      }
      .month {
        color: #eee;
        font-size: 32rpx;
      }
    }
    .title {
      width: 160rpx;
      text-align: center;
      padding: 10rpx 20rpx;
      margin-top: 20rpx;
      background-color: #eee;
      border-radius: 20rpx;
    }
  }
}
</style>