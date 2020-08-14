<template>
	<view class="content">
		<!-- 可移动选项卡 -->
		<view
			class="default-page"        
			:style="[{display: $store.state.fullScreen ? 'none' : 'flex'}]"
		>
			<default-nav @changeIndex="changeIndex" :tabIndex="activeIndex" @showPopup="show = !show" />
			<swiper
				class="tabs-swiper"
				:class="[$store.state.audioList.length ? 'small-height': '']"
				:current="activeIndex"
				@change="tabChange"
			>
				<swiper-item class="tab-swiper-item">
					<home-index
						@list="listShow"
						@songlist="songListShow"
						@model="modelShow"
					/>
				</swiper-item>
				<swiper-item class="tab-swiper-item">
					<find-index :refresh="refresh" />
				</swiper-item>
				<swiper-item class="tab-swiper-item">
					<village-index />
				</swiper-item>
				<swiper-item class="tab-swiper-item">
					<video-index />
				</swiper-item>
			</swiper>
		</view>
		<!-- 通过是否有播放列表控制显示 -->
    <play-music-index v-if="$store.state.audioList.length" />
		<!-- 加载 -->
    <view class="load" :style="[{display: loadStyle}]">
      <text class="load-title">音樂的力量</text>
      <view class="load-bottom">
        <text class="load-icon"><text class="iconfont icon-551488821353490553221"></text></text>
        网易云音乐
      </view>
    </view>
		<u-popup v-model="show" mode="left">
			<left-popup :visible="show" />
		</u-popup>
		<!-- 模态框 -->
    <u-modal
			v-model="showModel"
			@cancel="showDialog = false"
			show-cancel-button
			content="确认删除当前歌单？"
			@confirm="deleteSongList"
		>
		</u-modal>
    <!-- 动作面板 -->
    <u-popup v-model="showAction" mode="bottom" border-radius="30">
      <view v-if="active === 1">
        <view class="top on-touch">创建的歌单</view>
        <home-for :icons="createAction" @createSongList="createSongList" :height="0.8" />
      </view>
      <view v-if="active === 2">
        <view class="top on-touch">收藏的歌单</view>
        <home-for :icons="favoriteAction" :height="0.8" />
      </view>
      <view v-if="active === 3">
        <view class="top on-touch van-ellipsis">歌单: {{title}}</view>
        <home-for
          :icons="compile ? songListTwo : songListAction"
          :height="0.8"
          :uid="uid"
          :title="title"
          :description="description"
          @deleteSongList="deleteSongList"
        />
      </view>
    </u-popup>
    <!-- 弹出框 -->
    <u-modal
      v-model="showDialog"
      title="新建歌单"
      @confirm="addSongList"
      @cancel="showDialog = false"
      show-cancel-button
    >
      <u-field
        v-model="name"
        maxlength="40"
        label="名称"
        placeholder="请输入歌单标题"
        clearable
      >
      </u-field>
      <u-checkbox v-model="checked" shape="square" active-color="#dd001b">设置为隐私歌单</u-checkbox>
    </u-modal>
	</view>
</template>

<script>
import DefaultNav from '@/components/DefaultNav'
import HomeIndex from './components/home/index'
import FindIndex from './components/find/index'
import VillageIndex from './components/village/index'
import VideoIndex from './components/video/index'
import LeftPopup from './LeftPopup'
import PlayMusicIndex from './components/playMusic/PlayMusicIndex'
import HomeFor from '@/components/HomeFor'
import { mapGetters } from 'vuex'
import { CreateAction, SongListAction } from '@/common/icons'
import { playlistAdd, playlistDelete } from '@/api/apis'
export default {
	data() {
		return {
			list: [],
			activeIndex: 1,
			show: false,
			loadStyle: 'none',
			// 动作面板
			showAction: false,
			showModel: false,
      createAction: [],
      favoriteAction: [{
        text: '歌单管理',
        icon: 'iconfont icon-liebiaoguanli',
        event: 'no'
      }],
      songListAction: [],
      songListTwo: [],
      compile: false,
      active: 0,
      uid: 0,
      title: '',
      description: '',
      // 弹出框
      showDialog: false,
      name: '',
			checked: false,
			timer: null,
			refresh: 0
		}
	},
	onLoad () {
		// 初始化图标
		this.initData()
		const songListTwo = SongListAction().map(item => item)
    songListTwo.splice(2, 1)
		this.songListTwo = songListTwo
		// 初次动画
		if (!uni.getStorageSync('load')) this.loadLogo()
	},
	onPullDownRefresh() {
		if (this.timer) clearTimeout(this.timer)
		this.timer = setTimeout(() =>{
			if (this.activeIndex === 1) {
				this.refresh = +new Date()
			}
			uni.stopPullDownRefresh()
		}, 1000)
	},
	computed: {
		...mapGetters(['accountUid', 'loginState'])
	},
	methods: {
		toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
		},
		listShow (e) {
			this.showAction = e.showAction
      this.active = e.active
		},
		modelShow (e) {
			this.showDialog = e.showDialog
      this.showAction = e.showAction
		},
		songListShow (e) {
			this.showAction = e.showAction
			this.active = e.active
			this.uid = e.uid
			this.title = e.title
			this.description = e.description,
			this.compile = e.compile
		},
    initData () {
      this.createAction = CreateAction()
      this.songListAction = SongListAction()
    },
		changeIndex (index) {
			this.activeIndex = index
		},
		tabChange (e) {
			this.activeIndex = e.detail.current
		},
		// 加载
    loadLogo () {
      this.loadStyle = 'block'
      uni.setStorageSync('load', 'load')
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.loadStyle = 'none'
      }, 4000)
		},
		// 激活模态框
    createSongList () {
      if (!this.loginState) {
        this.toast('需要登录')
      } else {
        this.showDialog = true
        this.showAction = false
      }
    },
    // 删除歌单
    deleteSongList () {
			this.showModel = true
      this.showAction = false
      playlistDelete(this.uid)
        .then(() => {
          this.toast('删除成功')
          // 重新获取
          this.$store.commit('REFRESH') // 刷新
        })
    },
    // 添加歌单
    addSongList () {
      if (this.name === '') {
        this.toast('歌单名不能为空')
        return
      }
      const privacy = this.checked ? 10 : 0
      playlistAdd(this.name, privacy)
        .then(() => {
          this.toast('添加成功')
          this.$store.commit('REFRESH') // 刷新
        })
    }
	},
	onHide () {
		this.show = false
		this.showAction = false
		this.showDialog = false
		this.showModel = false
	},
	components: {
		DefaultNav,
		HomeIndex,
		FindIndex,
		VillageIndex,
		VideoIndex,
		LeftPopup,
		PlayMusicIndex,
		HomeFor
	}
}
</script>

<style lang="scss" scoped>
.content {
	position: relative;
}
.default-page {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: $height;
}
.load {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2020;
	display: none;
	width: $width;
	height: 100vh;
	font-size: 60rpx;
	color: #fff;
	background-color: $defaultColor;
	overflow: hidden;
	.load-title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80vh;
	}
	.load-bottom {
		font-size: 40rpx;
		text-align: center;
		opacity: 0;
		animation: icon 3s both;
		text {
			font-size: 45rpx;
		}
	}
}
.top {
	height: 80rpx;
	padding-left: 20rpx;
	line-height: 80rpx;
	border-bottom: 1px solid #eee;
	color: rgb(99, 96, 96);
}
@keyframes icon {
  100% {
    opacity: 1;
  }
}
</style>
