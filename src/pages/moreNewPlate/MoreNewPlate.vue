<template>
  <view class="new-plate">
    <PageNav
      :title="'新碟上架'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <loading :height="4.58" :style="[{display: loading ? 'flex' : 'none'}]"/>
    <!-- 新碟列表 -->
    <view class="new-plate-box" :style="[{display: !loading ? 'block' : 'none'}]">
      <view class="new-plate-item" v-for="(plate, index) in filterAlbums" :key="index">
        <view class="plate-title" v-if="plate.data.length">
          <text :style="[{display: (index === 0 && plate.data.length) ? 'block' : 'none'}]">本周新碟</text>
          <text class="month" :style="[{display: index !== 0 ? 'inline-block' : 'none'}]">
            {{new Date().getMonth() + 2 - index}}月
          </text>
          <text class="year" :style="[{display: index !== 0 ? 'inline-block' : 'none'}]">/{{new Date().getFullYear()}}</text>
        </view>
        <view class="song-list-con">
          <img-card
            v-for="(item, inx) in plate.data"
            :key="inx"
            :url="item.picUrl"
            :songtitle="item.name"
            :playCount="item.playCount"
            @goPage="goSongShow(item.id)"
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
import { newDish } from '@/api/apis'
export default {
  name: 'MoreNewPlate',
  data () {
    return {
      filterAlbums: [],
      loading: true
    }
  },
  created () {
    // 添加data
    for (let index = 0; index <= 2; index++) {
      this.filterAlbums[index] = { data: [] }
    }
    // 获取要请求的个数, 这里设置120个
    // const limit = this.$route.query.total
    this.getNewDish(120)
  },
  methods: {
    getNewDish (limit) {
      newDish(limit)
        .then(data => {
          // 根据publishTime排序 倒序
          // const albums = data.albums.sort((a, b) => b.publishTime - a.publishTime)
          // 不需要排序
          this.filterData(data.albums)
          this.$nextTick(() => {
            this.loading = false
          })
        })
    },
    goSongShow (id) {
       uni.navigateTo({
				url: `../showsong/showSongList?dishId=${id}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    // 根据日期分割数据
    filterData (arr) {
      // 获取星期一
      const date = new Date()
      // 星期天特殊处理
      const week = date.getDay() ? date.getDay() : 7
      const monday = date.getTime() - ((week - 1) * 24 * 60 * 60 * 1000)
      // 本周数据
      this.filterAlbums[0].data = arr.filter(val => val.publishTime >= monday)
      const weekArr = this.filterAlbums[0].data
      // 去除本周数组
      const monthArr = arr.filter(val => !weekArr.some(item => val.publishTime === item.publishTime))
      console.log('monthArr: ', monthArr);
      // 本月
      const month = date.getMonth() + 1
      // 这个月和上个月数据
      for (let i = 0; i <= 1; i++) {
        this.filterAlbums[i + 1].data = monthArr.filter(val => new Date(val.publishTime).getMonth() + 1 === month - i)
      }
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
.new-plate-box {
  padding: 100rpx 20rpx 0;
  .plate-title {
    padding: 30rpx 0;
    font-size: 34rpx;
    color: black;
    font-weight: bold;
    .month {
      font-size: 42rpx;
    }
    .year {
      color: rgb(148, 142, 142);
    }
  }
  .song-list-con {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>