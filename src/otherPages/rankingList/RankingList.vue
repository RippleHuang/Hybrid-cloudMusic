<template>
  <view class="ranking-list">
    <PageNav
      :title="'排行榜'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <loading :height="4.58" :style="[{display: loading ? 'flex' : 'none'}]"/>
    <view class="ranking-box" :style="[{display: !loading ? 'block' : 'none'}]">
      <!-- 官方榜 -->
      <text class="ranking-title">官方榜</text>
      <!-- key重复 -->
      <view class="list on-touch"
        v-for="(rankingItem, indexs) in official" :key="indexs"
        @tap="goSongShow(rankingItem.id)"
      >
        <view class="img-info">
          <image :src="rankingItem.coverImgUrl + '?param=150y150'" />
          <text class="time">{{ rankingItem.updateFrequency }}</text>
        </view>
        <view class="list-con">
          <view class="info u-line-1" v-for="(item, inx) in rankingItem.tracks" :key="inx">
            {{inx + 1 + '.'}}
            <text>{{item.first}}</text> -
            <text>{{item.second}}</text>
          </view>
        </view>
      </view>
      <!-- 其他榜单 -->
      <view class="ranking-for" v-for="(ranking, index) in rankingData" :key="index + 'title'">
        <text class="ranking-title">{{ranking.title}}</text>
        <view class="song-list-con">
          <img-card
            v-for="(item, inx) in ranking.data" :key="inx"
            :url="item.coverImgUrl"
            :songtitle="item.name"
            :updateTime="item.updateFrequency"
            :playCount="item.playCount"
            :albumId="item.id"
            rangking
            @goPage="goSongShow"
          />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import Loading from '@/components/Loading'
import ImgCard from '@/components/ImgCard'
import { topList } from '@/api/apis'
import { getRandomNumberArray } from '@/common/randomNumberArray'
export default {
  name: 'RankingList',
  data () {
    return {
      official: [],
      rankingData: [{
        data: [],
        title: '榜单推荐'
      }, {
        data: [],
        title: '更多榜单'
      }],
      loading: true
    }
  },
  onLoad () {
    this.getTopList()
  },
  methods: {
    getTopList () {
      topList()
        .then(data => {
          this.official = data.list.slice(0, 4)
          // 随机3项
          this.rankingData[0].data = getRandomNumberArray(data.list, 3)
          this.rankingData[1].data = data.list.slice(3)
          this.$nextTick(() => {
            this.loading = false
          })
        })
		},
		goSongShow (id) {
      uni.navigateTo({
				url: `../showsong/showSongList?albumId=${id}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    }
  },
  components: {
    PageNav,
    Loading,
    ImgCard
  }
}
</script>
<style lang='scss' scoped>
.ranking-list {
	height: 100vh;
	overflow-y: scroll;
	scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.ranking-box {
  padding-top: 140rpx;
  .list {
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    .img-info {
      position: relative;
      width: $width*0.315;
      padding: 10rpx 0;
      image {
        width: $width*0.315;
        height: $width*0.315;
        border-radius: 10rpx;
      }
      .time {
        position: absolute;
        left: 20rpx;
        bottom: 30rpx;
        font-size: 22rpx;
        color: #fff;
      }
    }
    .info {
      width: 60vw;
      padding-left: 20rpx;
      line-height: 2;
    }
  }
  .ranking-title {
		display: block;
    padding: 30rpx 20rpx;
    font-size: 34rpx;
    color: black;
    font-weight: bold;
  }
  .song-list-con {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20rpx;
  }
}
</style>
