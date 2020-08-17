<template>
  <!-- 迷你播放器留空 -->
  <view class="song-square" :class="[audioList.length ? 'small-height' : '']">
    <page-nav
      :title="'歌单广场'"
      :background="'#dd001b'"
      defaultShow
    />
    <!-- 选项卡 -->
		<view class="songlist-tabs">
			<u-tabs-swiper
				ref="songListTabs"
				:list="getData"
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
					<scroll-view class="songlist-scroll" scroll-y @scrolltolower="pullDown">
						<view class="song-list-con">
							<img-card
								v-for="(item, inx) in data.data"
								:key="inx"
								:url="item.coverImgUrl"
								:songtitle="item.name"
								:playCount="item.playCount"
								@goPage="goSongShow(item.id)"
							/>
						</view>
					</scroll-view>
					<text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
				</swiper-item>
			</swiper>
      <!-- 下拉加载 -->
      <loading :height="0.8" :style="[{display: reload ? 'flex' : 'none', bottom: '0px', position: 'fixed'}]"/>
		</view>
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import Loading from '@/components/Loading'
import ImgCard from '@/components/ImgCard'
import { recSongList, highQuality } from '@/api/apis'
import { mapGetters } from 'vuex'
export default {
  name: 'SongListSquare',
  data () {
    return {
      active: 0,
			swiperActive: 0,
      // 加载相关
      loading: true,
      reload: false,
      finished: false,
      // 歌单相关
      songList: [],
      lasttime: 0, // 精品下一页
      total: 0, // 总数
      getData: [{
        name: '推荐',
        data: [],
        cat: '全部',
        sum: 0 // 页数, 一进入页面会触发 onLoad,所以从-1开始
      }, {
        name: '精品',
        data: [],
        cat: '全部'
      }, {
        name: '华语',
        data: [],
        cat: '华语',
        sum: 0
      }, {
        name: 'ACG',
        data: [],
        cat: 'ACG',
        sum: 0
      }, {
        name: '轻音乐',
        data: [],
        cat: '轻音乐',
        sum: 0
      }, {
        name: '电子',
        data: [],
        cat: '电子',
        sum: 0
      }, {
        name: '古风',
        data: [],
        cat: '古风',
        sum: 0
      }]
    }
	},
	onLoad () {
		this.getRecSongList(30, this.getData[0].cat, 0)
  },
  computed: {
    ...mapGetters(['audioList'])
  },
  watch: {
    // active 变化清空数据
    active: {
      handler (val, oldV) {
        this.finished = false
        this.songList = []
        // 首次需要加载
        if (this.getData[val].data.length === 0) {
					this.loading = true
					if (val !== 1) this.getRecSongList(30, this.getData[this.active].cat, 0)
					else this.getHighQuality(30, 0, this.getData[1].cat)
        }
      }
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
			this.$refs.songListTabs.setFinishCurrent(current)
			this.swiperActive = current
			this.active = current
    },
    getRecSongList (limit, cat, offset) {
      recSongList(limit, cat, offset)
        .then(data => {
          this.songList = data.playlists
          this.total = data.total
          this.division()
        })
		},
		goSongShow (id) {
      uni.navigateTo({
				url: `../showsong/showSongList?albumId=${id}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    getHighQuality (limit, before, cat) {
      highQuality(limit, before, cat)
        .then(data => {
          this.songList = data.playlists
          this.lasttime = data.lasttime
          this.total = data.total
          this.division()
        })
    },
    // 30个为一组
    division () {
      // 对应active
      if (!this.finished) this.getData[this.active].data.push(...this.songList)
      // 加载状态结束
      this.$nextTick(() => {
        this.loading = false
        this.reload = false
      })
      // 数据全部加载完成
      if (this.getData[this.active].data.length >= this.total) {
        this.finished = true
      }
    },
    pullDown () {
			this.reload = true
      if (this.active !== 1) {
        this.getData[this.active].sum++
        // 推荐歌单以及其他分类
        this.getRecSongList(30, this.getData[this.active].cat, this.getData[this.active].sum * 30)
      } else {
        // 精品歌单
        this.getHighQuality(30, this.lasttime, this.getData[1].cat)
      }
    }
  },
  components: {
    PageNav,
    ImgCard,
    Loading
  }
}
</script>
<style lang='scss' scoped>
.songlist-tabs {
	height: calc(100vh - 60px);
  /*  #ifdef MP  */
  margin-top: -1px;
  /*  #endif  */
  padding-top: $height;
  box-sizing: border-box;
}
.songlist-scroll {
	height: 100vh;
}
.song-list-con {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
	padding: 100rpx 20rpx 0;
}
</style>
