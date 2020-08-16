<template>
  <scroll-view scroll-y class="user-info" @scroll="songScroll" :style="[{ background: `url(${coverImgUrl}) fixed` }]">
    <opacity-card
      :isFixed="isFixed"
      :followeds="followeds"
      :newFollows="newFollows"
      :gender="gender"
      :birthday="birthday"
      :coverImgUrl="coverImgUrl"
      :avatarUrl="avatarUrl"
      :level="level"
      :nickName="nickName"
      :loading="loading"
    />
    <view class="user-tab">
			<u-tabs-swiper
        ref="searchTabs"
        :list="list"
        active-color="#dd001b"
        inactive-color="rgba(0, 0, 0, .95)"
        bg-color="#fff"
        gutter="100"
        bar-width="50"
        :current="active"
        @change="tabsChange"
      >
      </u-tabs-swiper>
			<loading :height="4.58" :style="[{display: !loading ? 'flex' : 'none'}]"/>
			<swiper
        class="tabs-swiper"
        :current="swiperActive"
        @animationfinish="animationfinish"
      >
				<!-- 主页 -->
        <swiper-item class="tab-swiper-item">
          <view class="show" :style="[{display: loading ? 'flex' : 'none'}]">
            <view class="song-group">
              <!-- 听歌排行 -->
              <view class="song-list" @tap="goRecent">
                <view class="left">
                  <view class="list-cover">
                    <view class="bgc">
                      <text class="iconfont icon-paihangbang"></text>
                    </view>
                  </view>
                  <view class="list-info">
                    <text class="list-title first">听歌排行</text>
                    <text class="list-num">累计听歌 {{listenSongs}}首</text>
                  </view>
                </view>
              </view>
              <!-- 我喜欢的音乐 -->
              <song-list-li
                v-for="(item, index) in myLoveList" :key="index"
                :coverImgUrl="item.coverImgUrl"
                :name="item.name"
                :trackCount="item.trackCount"
                :privacy="item.privacy"
                myLove
                :playCount="item.playCount"
                @eventThing="goSongShow(item.id)"
              />
            </view>
            <!-- 创建的歌单 -->
            <view class="song-group" v-if="createNum !== 1">
              <text class="title">创建的歌单 <text class="number">({{createNum - 1}})</text></text>
              <song-list-li
                v-for="(item, index) in createList" :key="index"
                :coverImgUrl="item.coverImgUrl"
                :name="item.name"
                :trackCount="item.trackCount"
                :privacy="item.privacy"
                :playCount="item.playCount"
                userInfo
                @eventThing="goSongShow(item.id)"
              />
              <view class="more on-touch" v-if="createNum > 10" @tap="moreList">更多歌单&nbsp;&gt;</view>
            </view>
            <!-- 收藏的歌单 -->
            <view class="song-group" v-if="favoritesNum !== 0">
              <text class="title">收藏的歌单 <text class="number">({{favoritesNum}})</text></text>
              <song-list-li
                v-for="(item, index) in favoritesList" :key="index"
                :coverImgUrl="item.coverImgUrl"
                :name="item.name"
                :trackCount="item.trackCount"
                :creatorNickname="item.creator.nickname"
                :privacy="0"
                userInfo
                :playCount="item.playCount"
                @eventThing="goSongShow(item.id)"
              />
              <view class="more on-touch" v-if="favoritesNum > 10" @tap="moreList">更多歌单&nbsp;&gt;</view>
            </view>
            <view class="basic-information">
              <text class="title">基本信息</text>
              <view class="list-info" v-if="year">
                <text class="list-name">村龄：</text>
                <text class="list-con">{{age}}年 ( {{year}}年{{month}}月注册 )</text>
              </view>
              <view class="list-info" v-if="birthday > 0">
                <text class="list-name">年龄：</text>
                <text class="list-con-age">{{ birthday | filterAge }}后 </text>
                <text class="list-con-astro"> {{astro}}座</text>
              </view>
              <view class="list-info">
                <text class="list-name">性别：</text>
                <text class="list-con">{{gender === 1 ? '男' : '女' }}</text>
              </view>
              <view class="list-info">
                <text class="list-name">个人介绍：</text>
                <text class="list-con">{{signature}}</text>
              </view>
              <view class="more on-touch" @tap="noAchieve">更多信息&nbsp;&gt;</view>
            </view>
          </view>
        </swiper-item>
        <!-- 动态 -->
        <swiper-item class="tab-swiper-item">
          <scroll-view scroll-y class="dynamic-info" @scrolltolower="pullDown">
            <view class="data-info" v-if="size === 0">暂时还没有动态哦</view>
						  <dynamic-card
								:dataMsg="dataMsg"
								:loading="loading"
							/>
            <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
          </scroll-view>
        </swiper-item>
      </swiper>
			<loading :height="0.8" :style="[{display: reload ? 'flex' : 'none', bottom: '0px', position: 'fixed'}]"/>
    </view>
  </scroll-view>
</template>
<script>
import OpacityCard from './OpacityCard'
import SongListLi from '@/components/SongListLi'
import Loading from '@/components/Loading'
import DynamicCard from '@/components/DynamicCard'
import { mapGetters } from 'vuex'
import { userDetail, playlist, userEvent } from '@/api/apis'
import { filterAge } from '@/common/filters'
import { getAstro } from '@/common/getAstro'
export default {
  name: 'UserInfo',
  data () {
    return {
      // tab激活
     	active: 0,
			swiperActive: 0,
      // 预览图片
      show: false,
      // 用户信息
      accountUid: 0,
      avatarUrl: '',
      level: 0,
      nickName: '',
      gender: 1,
      signature: '',
      age: 0,
      listenSongs: 0,
      birthday: 0,
      newFollows: 0,
      followeds: 0,
      year: 0,
      astro: '',
      month: 0,
      coverImgUrl: '',
      // 歌单信息
      createNum: 0,
      favoritesNum: 0,
      myLoveList: [],
      createList: [],
      favoritesList: [],
      // 加载
			loading: false,
			reload: false,
      finished: false,
      // 后代组件是否刷新
      refresh: 0,
			list: [{
				name: '主页'
			}, {
				name: '动态'
			}],
			dataMsg: [],
			lasttime: -1,
      isFixed: false,
      size: 0
    }
  },
  onLoad (option) {
    this.accountUid = option.accountUid * 1
  },
  computed: {
    ...mapGetters(['loginState'])
  },
  /* 监听uid变化 */
  watch: {
    accountUid: {
      async handler (val, oldVal) {
        if (this.loginState) {
          this.loading = false
          await this.initData(val)
          this.getSongList(val)
          this.getUserEvent(val)
          // 通知后代组件刷新
          this.refresh = +new Date()
        } else {
          // 跳转到登录页
          this.$router.push('/login')
        }
      }
    }
  },
  methods: {
		goSongShow (id) {
      uni.navigateTo({
				url: `../showsong/showSongList?albumId=${id}`,
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
		toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    // 用户数据
    initData (uid) {
      userDetail(uid)
        .then(data => {
          this.listenSongs = data.listenSongs
          this.level = data.level
          this.coverImgUrl = data.profile.backgroundUrl ? data.profile.backgroundUrl
            : 'http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg'
          const { gender, signature, birthday, newFollows, followeds, avatarUrl, nickname, playlistCount } = data.profile
          this.followeds = followeds
          this.newFollows = newFollows
          this.avatarUrl = avatarUrl
          this.nickName = nickname
          // 创建的歌单数
          this.createNum = playlistCount
          this.gender = gender
          this.signature = signature
          this.birthday = birthday
          const createTime = data.createTime
          // 单独判断创建日
          if (createTime > 0) {
            const createDate = new Date(createTime)
            this.year = createDate.getFullYear()
            this.month = createDate.getMonth() + 1
            this.age = parseInt(data.createDays / 365)
          }
          // 单独判断是否有生日
          if (this.birthday > 0) {
            const setAstro = new Date(birthday)
            this.astro = getAstro(setAstro.getMonth() + 1, setAstro.getDate())
          }
        })
        .catch(() => {
          this.toast('获取用户信息失败,请稍后尝试')
        })
    },
    // 获取歌单
    getSongList (uid) {
      playlist(uid)
        .then(data => {
          this.getUserInfo(data.playlist)
        })
        .catch(() => {
          this.toast('获取歌单失败,请稍后尝试')
        })
    },
    // 获取歌单数
    getUserInfo (arr) {
      // 分割
      const SongListCreate = arr.slice(0, this.createNum)
      // 我喜欢的音乐
      this.myLoveList = SongListCreate.slice(0, 1)
      // 大于截取10,小于取自身,创建音乐需要加一
      const createNumSlice = this.createNum > 11 ? 11 : this.createNum
      this.createList = SongListCreate.slice(1, createNumSlice)
      // 收藏的音乐
      if (arr.length - this.createNum > 0) {
        // 收藏的歌单数
        this.favoritesNum = arr.length - this.createNum
        const favoritesNumSlice = this.favoritesNum > 10 ? 10 : this.favoritesNum
        this.favoritesList = arr.slice(this.createNum, this.createNum + favoritesNumSlice)
      } else {
        this.favoritesNum = 0
        this.favoritesList = []
      }
      this.$nextTick(() => {
        this.loading = true
      })
    },
		// 获取用户动态
    getUserEvent (id, lasttime) {
      userEvent(id, 30, lasttime)
        .then(data => {
          this.list[1].name += data.size
          this.size = data.size
          this.lasttime = data.lasttime
					if (data.events != null) this.dataMsg.push(...data.events)
					else this.finished = true
          this.$nextTick(() => {
						this.loading = true
						this.reload = false
          })
        })
		},
		pullDown () {
      this.list[1].name = '动态'
			if (!this.finished) {
				this.reload = true
				this.getUserEvent(this.accountUid, this.lasttime)
			}
		},
    rollback () {
       uni.navigateBack({
				delta: 1,
				animationType: 'pop-out',
				animationDuration: 200
			})
    },
    // 跳转到展示页
    moreList () {
			const { accountUid, createNum, favoritesNum, nickName } = this
			uni.navigateTo({
				url: `../listAll/ListAll?createNum=${createNum}&favoritesNum=${favoritesNum}&nickName=${nickName}&uid=${accountUid}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    // 听歌排行
    goRecent () {
      const { accountUid, nickName } = this
			uni.navigateTo({
				url: `../recentPlay/RecentPlay?uid=${accountUid}&name=${nickName}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		songScroll (e) {
			if (e.detail.scrollTop >= 200) this.isFixed = true
			else this.isFixed= false
    },
    noAchieve () {
      this.toast('此功能尚未开通, 敬请期待')
    }
  },
  filters: {
    filterAge
  },
  components: {
    OpacityCard,
    SongListLi,
    Loading,
    DynamicCard
  }
}
</script>
<style lang='scss' scoped>
[v-cloak] {
  display: none;
}
.user-info {
  // 给头部 fixed 的留空
  height: 100vh;
  padding-top: $height;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
  .user-tab {
    height: 90vh;
    background-color: #fff;
    border-radius: 40rpx 40rpx 0 0;
    overflow: hidden;
    .dynamic-info {
      height: 90vh;
    }
    .more {
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      color: rgb(65, 62, 62);
    }
    .song-group {
      padding: 20rpx 0;
      overflow-x: hidden;
      .bgc {
        background-image: linear-gradient(to bottom, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%) !important;
      }
    }
    .basic-information {
      .list-info {
        padding: 10rpx 30rpx;
        color: #7b7c7e;
        font-size: 25rpx;
        .list-con {
          line-height: 1.3;
        }
      }
    }
    .size {
      position: absolute;
      left: 60%;
      top: 34rpx;
      font-size: 22rpx;
      color: rgb(180, 177, 177);
    }
    // 没有动态
    .data-info {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 320rpx;
    }
  }
}
.show {
  display: flex;
  flex-flow: column;
}
.first {
	width: 300rpx !important;
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
</style>