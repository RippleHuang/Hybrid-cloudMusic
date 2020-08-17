<template>
  <view class="search-result">
    <search-input
      :text="keyword"
			:searchPage="searchPage"
      @searchResult="searchResult"
    />
    <!-- 选项卡 -->
    <view class="search-tabs">
      <u-tabs-swiper
        ref="searchTabs"
        :list="searchData"
        active-color="#fff"
        inactive-color="rgba(255, 255, 255, .95)"
        bg-color="#dd001b"
        gutter="100"
        bar-width="50"
        :current="active"
        @change="tabsChange"
      >
      </u-tabs-swiper>
      <!-- 搜索结果 -->
      <loading :height="4.58" :style="[{display: loading ? 'flex' : 'none'}]"/>
      <swiper
        class="tabs-swiper"
        :current="swiperActive"
        @animationfinish="animationfinish"
        :style="[{display: !loading ? 'block' : 'none'}]"
      >
        <!-- 综合 -->
        <swiper-item class="tab-swiper-item">
          <result-all-type
            :resultData="searchData[0].data"
            @changeActive="changeActive"
            @searchSim="searchResult"
          />
        </swiper-item>
        <!-- 其他分类 -->
        <!-- 单曲 -->
        <swiper-item class="tab-swiper-item">
          <scroll-view scroll-y class="scroll-down" @scrolltolower="pullDown">
            <view class="play on-touch" @tap="playAll(searchData[1].data)">
              <text class="iconfont icon-bofang1"></text>
              播放全部
            </view>
            <view class="song-group">
              <song-list-li
                v-for="(item, index) in searchData[1].data" :key="index"
                songShow
                :number="index+1"
                :active="item.id === audioIngSong.id"
                :artists="item.artists"
                :albumName="item.album.name"
                :name="item.name"
                :privacy="0"
                home
                @playSong="play(item)"
              />
            </view>
            <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
          </scroll-view>
        </swiper-item>
        <!-- 视频 -->
        <swiper-item class="tab-swiper-item">
          <scroll-view scroll-y class="scroll-down" @scrolltolower="pullDown">
            <video-list
              :videoData="searchData[2].data"
              search
            />
            <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
          </scroll-view>
        </swiper-item>
        <!-- 歌手 -->
        <swiper-item class="tab-swiper-item">
          <scroll-view scroll-y class="scroll-down" @scrolltolower="pullDown">
            <artists-or-user
              :otherData="searchData[3].data"
              songer
            />
            <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
          </scroll-view>
        </swiper-item>
        <!-- 专辑 -->
        <swiper-item class="tab-swiper-item">
          <scroll-view scroll-y class="scroll-down song-group" @scrolltolower="pullDown">
            <song-list-li
              v-for="(item, index) in searchData[4].data" :key="index"
              :coverImgUrl="item.picUrl"
              :name="item.name"
              :artists="item.artists"
              :trackCount="item.size"
              :publishTime="item.publishTime"
              :privacy="0"
              :songListId="item.id"
              @eventThing="goSongShow(item.id, 'dishId')"
            />
            <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
          </scroll-view>
        </swiper-item>
        <!-- 歌单 -->
        <swiper-item class="tab-swiper-item">
          <scroll-view scroll-y class="scroll-down song-group" @scrolltolower="pullDown">
            <song-list-li
              v-for="(item, index) in searchData[5].data" :key="index"
              :coverImgUrl="item.coverImgUrl"
              :name="item.name"
              :trackCount="item.trackCount"
              :creatorNickname="item.creator.nickname"
              userInfo
              :privacy="0"
              :playCount="item.playCount"
              @eventThing="goSongShow(item.id, 'albumId')"
            />
            <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
          </scroll-view>
        </swiper-item>
        <!-- 用户 -->
        <swiper-item class="tab-swiper-item">
          <scroll-view scroll-y class="scroll-down" @scrolltolower="pullDown">
            <artists-or-user
              :otherData="searchData[6].data"
              user
            />
            <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
          </scroll-view>
        </swiper-item>
      </swiper>
      <!-- 下拉加载 -->
      <loading :height="0.8" :style="[{display: reload ? 'flex' : 'none', bottom: '0px', position: 'fixed'}]"/>
    </view>
  </view>
</template>
<script>
import { search } from '@/api/apis'
import { mapGetters } from 'vuex'
import SearchInput from '@/components/SearchInput'
import ResultAllType from './ResultAllType'
import Loading from '@/components/Loading'
import SongListLi from '@/components/SongListLi'
import ArtistsOrUser from '@/components/ArtistsOrUser'
import VideoList from '@/components/VideoList'
export default {
  name: 'searchresult',
  data () {
    return {
			active: 0,
			swiperActive: 0,
      // 加载相关
      loading: true,
      reload: false,
      finished: false,
      list: [],
      keyword: '',
      searchPage: '',
      searchData: [{
        name: '综合',
        type: 1018
      }, {
        name: '单曲',
        type: 1
      }, {
        name: '视频',
        type: 1014
      }, {
        name: '歌手',
        type: 100
      }, {
        name: '专辑',
        type: 10
      }, {
        name: '歌单',
        type: 1000
      }, {
        name: '用户',
        type: 1002
      }]
    }
  },
	onLoad (option) {
		this.searchPage = option.search
		this.keyword = option.text
    // 添加新属性data, sum
    for (let index = 0; index <= 6; index++) {
      this.$set(this.searchData[index], 'sum', 0)
      if (index === 0) this.$set(this.searchData[0], 'data', {})
      else this.$set(this.searchData[index], 'data', [])
    }
    this.getSearch(option.text, 0, 1018)
  },
  computed: {
    ...mapGetters(['audioIngSong'])
  },
  watch: {
    // active 变化清空数据
    active: {
      handler (val, oldV) {
        // 需要清空数据
        this.finished = false
        this.list = []
        // 请求第一页数据
        if (this.searchData[val].data.length === 0) {
          this.loading = true
          this.getSearch(this.keyword, 0, this.searchData[this.active].type)
        }
      }
    },
    keyword (val, oldV) {
      // 搜索词变化需要清空上一次结果
      for (let index = 0; index <= 6; index++) {
        this.searchData[index].data = []
        this.searchData[index].sum = 0
      }
    }
  },
  methods: {
		play (song) {
			this.$store.dispatch('addToAudioList', song)
    },
    playAll (song) {
			this.$store.dispatch('startPlayAll', song)
		},
    goSongShow (id, type) {
      uni.navigateTo({
				url: `../showsong/showSongList?${type}=${id}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
		tabsChange(index) {
			this.swiperActive = index
    },
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current
			this.$refs.searchTabs.setFinishCurrent(current)
			this.swiperActive = current
			this.active = current
    },
    changeActive (index) {
      this.active = index
      this.swiperActive = index
    },
    searchResult (keyword) {
      this.keyword = keyword
      // 需要清空数据
      this.finished = false
      this.list = []
      this.searchData[this.active].data = []
      this.searchData[this.active].sum = 0
      this.loading = true
      this.getSearch(keyword, 0, this.searchData[this.active].type)
    },
    getSearch (keyword, offset, type) {
      search(keyword, 30, offset, type)
        .then(data => {
          if (data.result) {
            this.list = data.result
            this.division()
          } else {
            // 直接结束
            this.finished = true
            this.reload = false
          }
        })
    },
    // 30个为一组
    async division () {
      const dataName = ['', 'songs', 'videos', 'artists', 'albums', 'playlists', 'userprofiles']
      if (this.active === 0) {
        this.searchData[0].data = this.list
        // 直接结束
        this.finished = true
      } else {
        // 数据全部加载完成, (data || [])防止报错
        const list = this.list[dataName[this.active]] ? this.list[dataName[this.active]] : []
        if (list.length === 0) {
          this.finished = true
        } else {
          await this.searchData[this.active].data.push(...(this.list[dataName[this.active]]))
        }
      }
      // 加载状态结束
      this.$nextTick(() => {
        this.loading = false
        this.reload = false
      })
    },
    pullDown () {
      if (this.active !== 0) {
        this.reload = true
        this.searchData[this.active].sum++
        // 歌单以及其他分类
        const keyword = this.keyword ? this.keyword : this.$route.query.text
        this.getSearch(keyword, this.searchData[this.active].sum * 30, this.searchData[this.active].type)
      }
    }
  },
  components: {
    SearchInput,
    ResultAllType,
    Loading,
    SongListLi,
    ArtistsOrUser,
    VideoList
  }
}
</script>
<style lang='scss' scoped>
.search-tabs {
  height: calc(100vh - 60px);
  /*  #ifdef MP  */
  margin-top: -1px;
  /*  #endif  */
  padding-top: $height;
  box-sizing: border-box;
  .tabs-swiper {
    padding-top: 40px;
    box-sizing: border-box;
    .scroll-down {
      height: 85vh;
    }
    .play {
      padding: 30rpx 38rpx;
      font-size: 26rpx;
      .icon-bofang1 {
        padding-right: 20rpx;
        font-size: 32rpx;
      }
    }
  }
}
.tab-swiper-item {
  padding-top: 3px;
  box-sizing: border-box;
}
</style>

