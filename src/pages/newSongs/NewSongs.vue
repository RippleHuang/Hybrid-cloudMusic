<template>
  <view class="new-songs">
    <PageNav
      :title="'最新音乐'"
      :background="'#dd001b'"
      :height="'60px'"
      defaultShow
    />
    <!-- 选项卡 -->
		<view class="newsongs-tabs">
			<u-tabs-swiper
				ref="newsongsTabs"
				:list="getData"
				name="title"
				active-color="#fff"
				inactive-color="rgba(255, 255, 255, .95)"
				bg-color="#dd001b"
				gutter="100"
				bar-width="50"
				:current="active"
				@change="tabsChange"
			>
			</u-tabs-swiper>
			<loading :height="4.58" :style="[{display: loading ? 'flex' : 'none'}]"/>
			<swiper
				class="tabs-swiper"
				:current="swiperActive"
				@animationfinish="animationfinish"
				:style="[{display: !loading ? 'block' : 'none'}]"
			>
				<swiper-item class="tab-swiper-item" v-for="(data, index) in getData" :key="index">
					<scroll-view scroll-y class="show-song" @scrolltolower="pullDown" @scroll="songScroll">
						<view class="song-title" :style="{background: data.bgc}">
							<view class="mask" :style="{background: data.bgc}"></view>
							<text class="title">{{data.title}}</text>
						</view>
						<!-- 歌曲列表 -->
						<pubcli-sticky
							show
							newSong
							:loading="loading"
							:trackCount="trackCount"
							:songList="songList"
							:songListAll="data.data"
							:newAndrecommed="'0 10px 0 13px'"
							:stickyTop="'40px'"
						/>
						<text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
					</scroll-view>
				</swiper-item>
			</swiper>
      <!-- 下拉加载 -->
      <loading :height="0.8" :style="[{display: reload ? 'flex' : 'none', bottom: '50px', position: 'fixed'}]"/>
		</view>
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import PubcliSticky from '@/components/PubcliSticky'
import Loading from '@/components/Loading'
import { newSongs } from '@/api/apis'
export default {
  name: 'NewSongs',
  data () {
    return {
			active: 0,
			swiperActive: 0,
			songList: [],
			songListAll: [],
      // 加载相关
      loading: true,
      reload: false,
			finished: false,
			sum: 0,
			trackCount: 0,
			timer: null,
      getData: [{
        title: '推荐',
        data: [],
        type: 0,
        bgc: 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)'
      }, {
        title: '华语',
        data: [],
        type: 7,
        bgc: 'linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)'
      }, {
        title: '欧美',
        data: [],
        type: 96,
        bgc: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }, {
        title: '韩国',
        data: [],
        type: 16,
        bgc: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)'
      }, {
        title: '日本',
        data: [],
        type: 8,
        bgc: 'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)'
      }]
    }
  },
  watch: {
    // active 变化清空数据
    active: {
      handler (val, oldV) {
        this.sum = 0
        this.finish = false
        this.songList = []
        // 首次需要加载
        if (this.getData[val].data.length === 0) {
          this.loading = true
          // 推荐新歌根据active
          this.getNewSongs(this.getData[val].type)
        } else {
          const data = this.getData[val].data
          this.songListAll = data
          this.trackCount = data.length
          this.division()
        }
      },
      immediate: true
    }
	},
  methods: {
		tabsChange(index) {
			this.swiperActive = index
    },
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current
			this.$refs.newsongsTabs.setFinishCurrent(current)
			this.swiperActive = current
			this.active = current
		},
		songScroll (e) {
			if (e.detail.scrollTop >= 230) this.fixed = true
			else this.fixed = false
		},
    getNewSongs (type) {
      newSongs(type)
        .then(data => {
          this.getData[this.active].data = data.data
          this.songListAll = data.data
          this.trackCount = data.data.length
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
			})
			if (this.timer) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(() => {
				// 加载状态结束
        this.reload = false
			}, 500)
      // 数据全部加载完成
      if (result[this.sum] != null && result[this.sum].length < 30) {
        this.finish = true
      }
		},
		pullDown () {
			this.reload = true
			this.sum++
      if (this.reload) this.division()
		}
  },
  components: {
    PageNav,
		PubcliSticky,
		Loading
  }
}
</script>
<style lang='scss' scoped>
.newsongs-tabs {
  position: relative;
	height: calc(100vh - 60px);
  /*  #ifdef MP  */
  margin-top: -1px;
  /*  #endif  */
  padding-top: $height;
  box-sizing: border-box;
}
.show-song {
  height: 100vh;
}
.song-title {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 600rpx;
  padding-top: 40rpx;
  .mask {
    position: fixed;
    top: 80rpx;
    z-index: 5;
    width: $width;
    height: 80rpx;
    // 谷歌空白会有边框
    &::after {
      content: '.';
      opacity: 0;
    }
  }
  .title {
		display: block;
    margin-left: 20rpx;
    color: #fff;
    font-size: 50rpx;
    font-weight: bold;
    letter-spacing: 10rpx;
  }
}
</style>

