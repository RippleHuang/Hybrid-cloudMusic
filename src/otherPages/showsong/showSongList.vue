<template>
  <scroll-view scroll-y class="show-song" @scrolltolower="pullDown" @scroll="songScroll">
		<view class="show-song-box" :style="[{display: !showPreview ? 'block' : 'none'}]">
			<PageNav
				:title="fixed ? data.name : title"
				:background="'transparent'"
				:imgUrl="imgUrl + '?param=300y300'"
				:isFixedTitle="fixed"
				height="60px"
				v-if="imgUrl"
				isFixedSong
				songList
			/>
			<view class="body">
        <view class="mask" v-if="imgUrl" :style="[{ background: `url(${imgUrl}?param=300y300) center`}]"></view>
				<view class="container" @tap="showPreview = true">
					<view class="left">
						<img-card
              v-if="imgUrl"
							:url="imgUrl"
							:playCount="albumInfo.playCount"
							:albumId="albumId"
							:width="'100%'"
						/>
					</view>
					<view class="right">
						<text class="song-list-title u-line-2" :style="[{display: !loading ? 'flex' : 'none'}]">{{data.name}}</text>
						<!-- 去用户信息页 -->
						<view class="info u-line-1" :style="[{display: !loading ? 'flex' : 'none'}]" @tap.stop="goUserInfo">
							<image v-if="avatarUrl" :src="avatarUrl + '?param=50y50'"></image>
							<text class="nickname">{{nickname}} <text class="iconfont icon-arrow-right"></text></text>
						</view>
						<view class="song-list-info u-line-2" :style="[{display: !loading ? 'flex' : 'none'}]">
							<text class="u-line-2"
								v-if="uid === accountUid"
								@tap.stop="goCompile"
							>
							{{data.description ? data.description : '编辑信息'}}
							</text>
							<text class="u-line-2" v-else>
								{{data.description ? data.description : '暂无描述'}}
							</text>
							<text class="iconfont icon-arrow-right"></text>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="icon-fc">
						<text class="iconfont icon-xinxi" @tap="no"></text>
						<text class="text">{{commentCount ? commentCount : '评论'}}</text>
					</view>
					<view class="icon-fc">
						<text class="iconfont icon-fenxiang" @tap="no"></text>
						<text class="text">{{shareCount ? shareCount : '分享'}}</text>
					</view>
					<view class="icon-fc">
						<text class="iconfont icon-xiazai" @tap="no"></text>
						<text class="text">下载</text>
					</view>
					<view class="icon-fc">
						<text class="iconfont icon-duoxuan" @tap="no"></text>
						<text class="text">多选</text>
					</view>
				</view>
			</view>
			<view class="sticky">
				<pubcli-sticky
					:show="show"
					:loading="loading"
					:trackCount="trackCount"
					:songList="songList"
					:songListAll="albumId !== 0 ? songList : songListAll"
					:load="load"
					:finish="finish"
					:albumId="albumId"
					:dishId="dishId"
					:subNumber="subNumber"
					:uid="uid"
				/>
			</view>
		</view>
    <!-- 预览图片 -->
    <view :style="[{display: showPreview ? 'block' : 'none'}]" class="show-preview" @tap="showPreview = false">
			<view class="preview-con">
				<image v-if="imgUrl" class="preview-img" :src="imgUrl + '?param=300y300'"></image>
				<text class="preview-title">{{data.name}}</text>
				<text class="preview-tag" v-if="albumInfo.tags">
					标签:
					<text v-if="albumInfo.tags.length === 0">无</text>
					<text v-for="(item, index) in albumInfo.tags" :key="index"> {{item}}</text>
				</text>
				<text class="preview-dec">{{data.description}}</text>
			</view>
    </view>
		<!-- 下拉加载 -->
    <loading :height="0.8" :style="[{display: load ? 'flex' : 'none', bottom: '0', position: 'fixed'}]"/>
  </scroll-view>
</template>
<script>
import PageNav from '@/components/PageNav'
import ImgCard from '@/components/ImgCard'
import PubcliSticky from '@/components/PubcliSticky'
import Loading from '@/components/Loading'
import { albumDetail, playlistDetail, songInfo } from '@/api/apis'
import { mapGetters } from 'vuex'
export default {
  name: 'ShowSong',
  data () {
    return {
			songList: [],
      songListAll: [],
      loading: true,
      sum: 0,
      load: false,
      finish: false,
      // 歌单相关
      albumInfo: [],
      data: {
        name: '',
        description: ''
      },
      playListId: [],
      nickname: '',
      imgUrl: '',
      avatarUrl: '',
      commentCount: 0,
      shareCount: 0,
      trackCount: 0,
      title: '',
      // 歌单专辑id
      albumId: 0,
      dishId: 0,
      // 收藏数
      subNumber: 0,
      // 歌单用户id
      uid: 0,
      show: true,
      // 图片预览
			showPreview: false,
			// 吸顶
			fixed: false
    }
  },
  onLoad (option) {
		// 进来前清空
		this.sum = 0
    this.finish = false
    this.songList = []
    this.albumId = 0
    this.dishId = 0
    this.show = true
    this.playListId = []
    const albumId = option.albumId
    if (albumId) {
      this.albumId = JSON.parse(albumId)
      this.title = '歌单'
      this.getSongListInfo(this.albumId)
    } else {
      this.dishId = JSON.parse(option.dishId)
      this.title = '专辑'
      this.getDishInfo(this.dishId)
    }
    this.loading = true
    this.opacity = 1
	},
	onHide () {
		this.showPreview = false
	},
  computed: {
    ...mapGetters(['accountUid'])
  },
  methods: {
		toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
		},
		division () {
      const result = []
      for (var i = 0; i < this.songListAll.length; i += 30) {
        result.push(this.songListAll.slice(i, i + 30))
      }
      this.songList.push(...result[this.sum])
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
    // 歌单
    getSongListInfo (id) {
      playlistDetail(id)
        .then(data => {
          this.albumInfo = data.playlist
          this.subNumber = data.playlist.subscribedCount
          const length = data.playlist.trackIds.length
          this.initData(data.playlist, length)
          if (length) {
            // tracks 中的歌是不完整的,最多20个,需要通过trackIds中的id获取单个歌曲详情
            const arr = []
            data.playlist.trackIds.forEach((val, index) => {
              arr[index] = val.id
            })
            // 分割为30个为一组
            for (var text = 0; text < arr.length; text += 30) {
              this.playListId.push(arr.slice(text, text + 30))
            }
            // 先请求第一组数据
            this.getSongInfo(this.playListId[0].join())
          } else {
            this.loading = false
            this.show = false
          }
        })
    },
    // 获取专辑内容
    getDishInfo (id) {
      albumDetail(id)
        .then(data => {
          this.albumInfo = data
          this.songListAll = data.songs
          // 当有歌曲才获取数据
          const length = data.songs.length
          this.initData(data.album, length)
          if (length) {
            this.division()
          } else {
            this.loading = false
            this.show = false
          }
        })
    },
    initData (albumInfo, length) {
      this.data.name = albumInfo.name
      this.data.description = albumInfo.description
      this.nickname = albumInfo.creator ? albumInfo.creator.nickname : albumInfo.artist.name
      this.imgUrl = albumInfo.coverImgUrl ? albumInfo.coverImgUrl : albumInfo.picUrl
      this.avatarUrl = albumInfo.creator ? albumInfo.creator.avatarUrl : albumInfo.artist.picUrl
      // 当有歌曲才获取这些数据数据
      if (length) {
        this.uid = albumInfo.creator ? albumInfo.creator.userId : albumInfo.artist.id
        this.commentCount = albumInfo.info ? albumInfo.info.commentCount : albumInfo.commentCount
        this.shareCount = albumInfo.info ? albumInfo.info.shareCount : albumInfo.shareCount
        this.trackCount = 'trackCount' in albumInfo ? albumInfo.trackCount : albumInfo.size
      }
    },
    getSongInfo (ids) {
      // ids 支持多个参数,逗号分开
      songInfo(ids)
        .then(data => {
          this.showSongDivision(data.songs)
        })
    },
    goUserInfo () {
      if (this.albumInfo.creator && this.$store.state.loginState) {
        uni.navigateTo({
          url: '../userInfo/userInfo?accountUid=' + this.uid,
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else if (!this.$store.state.loginState) {
        this.toast('需要登录')
      } else {
        this.toast('暂不支持歌手信息页')
      }
    },
    // 编辑或预览
    goCompile () {
      // 为空编辑
      if (this.data.description) {
        this.showPreview = true
      } else {
        const { albumId, data } = this
        const description = data.description ? data.description : ''
        uni.navigateTo({
          url: `../compileSongList/CompileSongList?id=${albumId}&title=${data.name}&description=${description}`,
          animationType: 'pop-in',
          animationDuration: 200
        })
      }
    },
    showSongDivision (song) {
      this.songList.push(...song)
      this.$nextTick(() => {
        this.loading = false
        // 加载状态结束
        this.load = false
      })
      // 数据全部加载完成
      if (song.length < 30) {
				this.finish = true
      }
    },
    // 下拉加载
    pullDown () {
			this.sum++
      if (this.albumId !== 0) { // 歌单
        if (this.playListId[this.sum]) {
					this.load = true
          this.getSongInfo(this.playListId[this.sum].join())
        } else {
          this.finish = true
        }
      } else { // 专辑
        if (!this.finish) this.division()
      }
    },
    no () {
      this.toast('该功能尚未实装,预览,用户信息页,修改歌单可用')
		},
		songScroll (e) {
			if (e.detail.scrollTop >= 230) this.fixed = true
			else this.fixed = false
		}
  },
  components: {
    PageNav,
    ImgCard,
		PubcliSticky,
		Loading
  }
}
</script>
<style lang='scss' scoped>
.show-song {
	position: relative;
	height: 100vh;
	box-sizing: border-box;
  padding-top: 120rpx;
  background: rgba(0, 0, 0, .3);
  .body {
    position: relative;
    width: $width*0.928;
    margin: 40rpx auto 0;
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: -1;
      -webkit-filter: blur(15px);
      filter: blur(15px);
    }
    .container {
      display: flex;
      justify-content: space-between;
      .left {
        width: $width*0.38;
        height: $width*0.38;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: $width*0.5;
        text {
          font-size: 28rpx;
          color: #ddd;
        }
        .song-list-title {
          color: #fff;
          font-size: 33rpx;
          line-height: 1.3;
        }
        .info {
					align-items: center;
          height: 70rpx;
          &:active {
            background-color: rgb(202, 201, 201, .5);
          }
          image {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
          }
					.nickname {
						display: inline-block;
						margin-left: 10rpx;
						width: $width*0.48;
					}
          .iconfont {
            margin-left: 10rpx;
            font-size: 28rpx;
            color: #eee;
          }
        }
        .song-list-info {
          display: flex;
          align-items: center;
          .u-line-2 {
            font-size: 21rpx;
            line-height: 1.3;
            color: #ddd;
					}
					.iconfont {
						font-size: 32rpx;
					}
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-around;
      padding: 35rpx 0 35rpx;
      .icon-fc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        .iconfont {
          font-size: 38rpx;
          color: #fff;
        }
        .text {
          font-size: 26rpx;
          color: #ddd;
        }
      }
    }
	}
  .sticky {
    height: 60vh;
    background-color: #fff;
    border-radius: 40rpx 40rpx 0 0;
  }
  .show-preview {
		width: $width;
		height: calc(100vh - 60px);
    .preview-con {
      display: flex;
      flex-direction: column;
			justify-content: center;
			align-items: center;
      width: $width;
      padding: 0 50rpx;
			box-sizing: border-box;
			.preview-img {
				width: $width*0.6;
				height: $width*0.6;
				border-radius: 20rpx;
			}
      .preview-title {
				padding: 50rpx 0;
        color: #fff;
        font-size: 36rpx;
        text-align: center;
			}
      .preview-tag {
				width: $width;
				margin-top: 50rpx;
				padding-left: 50rpx;
        color: #fff;
        text {
          display: inline-block;
          margin-left: 20rpx;
          padding: 10rpx 20rpx;
          font-size: 24rpx;
          background-color: rgb(231, 224, 224, .2);
          border-radius: 20rpx;
        }
      }
      .preview-dec {
        height: 320rpx;
        margin-top: 40rpx;
        line-height: 1.5;
        color: #fff;
        overflow: scroll;
      }
    }
  }
}
</style>
