<template>
  <view class="list-all">
    <page-nav
      :title="nickname + '的歌单'"
      :background="'#dd001b'"
      defaultShow
    />
    <view class="listall-tabs">
      <u-tabs-swiper
        ref="listAllTabs"
        :list="list"
        active-color="#fff"
        inactive-color="rgba(255, 255, 255, .95)"
        bg-color="#dd001b"
        gutter="100"
        bar-width="100"
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
        <swiper-item class="tab-swiper-item" v-for="inx in 2" :key="inx">
          <view class="song-group">
            <song-list-li
              v-for="(item, index) in inx === 1 ? createListAll : favoritesListAll" :key="index"
              :coverImgUrl="item.coverImgUrl"
              :name="item.name"
              :trackCount="item.trackCount"
              :creatorNickname="inx === 2 ? item.creator.nickname : ''"
              :privacy="item.privacy"
              :playCount="item.playCount"
              :bottom="0.17"
              userInfo
              @eventThing="goSongShow(item.id)"
            />
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import SongListLi from '@/components/SongListLi'
import Loading from '@/components/Loading'
import { playlist } from '@/api/apis'
export default {
  name: 'ListAll',
  data () {
    return {
      active: 0,
			swiperActive: 0,
      createNum: 0,
      favoritesNum: 0,
      createListAll: [],
      favoritesListAll: [],
      nickname: '',
      loading: true,
			list: [{
				name: '创建的歌单'
			}, {
				name: '收藏的歌单'
			}]
    }
  },
  onLoad (option) {
		this.createNum = option.createNum
    this.favoritesNum = option.favoritesNum
    this.nickname = option.nickName
		this.list[0].name += this.createNum - 1
		this.list[1].name += this.favoritesNum
    this.getSongList(option.uid)
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
			this.$refs.listAllTabs.setFinishCurrent(current)
			this.swiperActive = current
			this.active = current
    },
    // 获取歌单
    getSongList (uid) {
      playlist(uid)
        .then(data => {
          this.getUserInfo(data.playlist)
        })
    },
    // 获取歌单数
    getUserInfo (arr) {
      // 分割
      this.createListAll = arr.slice(1, this.createNum)
      // 收藏的音乐
      if (arr.length - this.createNum > 0) {
        // 收藏的歌单数
        this.favoritesListAll = arr.slice(this.createNum, this.createNum + this.favoritesNum)
      } else {
        this.favoritesNum = 0
        this.favoritesListAll = []
      }
      this.$nextTick(() => {
        this.loading = false
      })
    }
	},
  components: {
    PageNav,
    SongListLi,
    Loading
  }
}
</script>
<style lang='scss' scoped>
.listall-tabs {
  padding-top: $height;
  .song-group {
     padding-top: 80rpx;
  }
}
</style>
