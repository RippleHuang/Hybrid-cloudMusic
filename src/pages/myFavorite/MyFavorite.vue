<template>
  <view class="my-favorite">
    <page-nav
      :title="'我的收藏'"
      :background="'#dd001b'"
      defaultShow
    />
		<view class="favorite-tabs">
			<u-tabs-swiper
				ref="myFavoriteTabs"
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
				<swiper-item class="tab-swiper-item">
					<!-- 收藏的专辑 -->
					<view class="song-group" v-if=" getData[0].data.length">
						<text class="title">收藏的专辑 <text class="number">({{getData[0].data.length}})</text></text>
						<song-list-li
							v-for="(item, index) in getData[0].data" :key="index"
							:coverImgUrl="item.picUrl"
							:name="item.name"
							:artists="item.artists"
							:trackCount="item.size"
							:privacy="0"
							:songListId="item.id"
							home
							@eventThing="goSongShow(item.id)"
						/>
					</view>
          <view class="empty" v-else>
						<text class="iconfont icon-kong"></text>
						<text>暂无内容</text>
					</view>
				</swiper-item>
				<swiper-item class="tab-swiper-item">
					<!-- 收藏的歌手 -->
					<artists-or-user
            v-if=" getData[1].data.length"
						:otherData="getData[1].data"
						favorite
					/>
          <view class="empty" v-else>
						<text class="iconfont icon-kong"></text>
						<text>暂无内容</text>
					</view>
				</swiper-item>
				<swiper-item class="tab-swiper-item">
					<!-- 收藏的视频 -->
					<video-list
            v-if=" getData[2].data.length"
						:videoData="getData[2].data"
					/>
          <view class="empty" v-else>
						<text class="iconfont icon-kong"></text>
						<text>暂无内容</text>
					</view>
				</swiper-item>
				<swiper-item class="tab-swiper-item">
					<!-- 收藏的专栏,Mlog -->
					<view class="empty">
						<text class="iconfont icon-kong"></text>
						<text>暂无内容</text>
					</view>
				</swiper-item>
        <swiper-item class="tab-swiper-item">
					<!-- 收藏的专栏,Mlog -->
					<view class="empty">
						<text class="iconfont icon-kong"></text>
						<text>暂无内容</text>
					</view>
				</swiper-item>
      </swiper>
		</view>
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import Loading from '@/components/Loading'
import SongListLi from '@/components/SongListLi'
import ArtistsOrUser from '@/components/ArtistsOrUser'
import VideoList from '@/components/VideoList'
import { favoriteAlbums, favoriteArtists, favoriteVideos } from '@/api/apis'
export default {
  name: 'MyFavorite',
  data () {
    return {
     	active: 0,
			swiperActive: 0,
      loading: true,
      getData: [{
        name: '专辑'
      }, {
        name: '歌手'
      }, {
        name: '视频'
      }, {
        name: '专栏'
      }, {
        name: 'Mlog'
      }]
    }
  },
  onLoad () {
		for (let i = 0; i < this.getData.length; i++) {
			this.$set(this.getData[i], 'data', [])
		}
    this.getArtists()
    this.getVideos()
    this.getAlbums()
  },
  watch: {
    '$store.state.refreshState': {
      handler (val, oldVal) {
        this.getAlbums()
      }
    }
  },
  methods: {
		goSongShow (id) {
      uni.navigateTo({
				url: `../showsong/showSongList?dishId=${id}`,
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
			this.$refs.myFavoriteTabs.setFinishCurrent(current)
			this.swiperActive = current
			this.active = current
    },
    getAlbums () {
      favoriteAlbums()
        .then(data => {
          this.getData[0].data = data.data
          this.getData[0].name += data.count
          // 保存专辑 id
          // 有本地数据先清空
          if (uni.getStorageSync('albumsId')) uni.removeStorageSync('albumsId')
          const albumsId = [];
          (data.data).forEach(element => {
            albumsId.push(element.id)
          })
          // 保存
          uni.setStorageSync('albumsId', JSON.stringify(albumsId))
          this.$nextTick(() => {
            this.loading = false
          })
        })
    },
    getArtists () {
      favoriteArtists()
        .then(data => {
          this.getData[1].data = data.data
          this.getData[1].name += data.count
        })
    },
    getVideos () {
      favoriteVideos()
        .then(data => {
          this.getData[2].data = data.data
          this.getData[2].name += data.count
        })
    }
  },
  components: {
    PageNav,
    Loading,
    SongListLi,
    ArtistsOrUser,
    VideoList
  }
}
</script>
<style lang='scss' scoped>
.my-favorite {
  padding-top: $height;
  .tab-swiper-item {
    padding-top: 100rpx;
    box-sizing: border-box;
  }
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
</style>