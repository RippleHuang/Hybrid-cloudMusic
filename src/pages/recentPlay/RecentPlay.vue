<template>
  <view class="recent-play">
    <page-nav
      :title="nickName + '的听歌排行'"
      :background="'#dd001b'"
      defaultShow
    />
    <view class="recentplay-tabs">
      <u-tabs-swiper
        ref="recentplayTabs"
        :list="list"
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
      >
        <swiper-item class="tab-swiper-item" v-for="(items, index) in 2" :key="index">
          <view class="content-recent" v-if="show">
            <loading :height="4.35" isabsolute :style="[{display: loading ? 'flex' : 'none'}]" />
            <view class="song-group" :style="[{display: !loading ? 'block' : 'none'}]">
              <song-list-li
                v-for="(item, ind) in items === 1 ? weekData : allData" :key="ind"
                songShow
                :number="ind+1"
                :active="item.song.id === audioIngSong.id"
                :artists="item.song.ar"
                :albumName="item.song.al.name"
                :name="item.song.name"
                :songplayCount="item.playCount"
                :home="item.playCount ? true : false"
                :privacy="0"
                @playSong="setAudioList(ind, items === 1 ? weekDataSong : allDataSong)"
              />
            </view>
          </view>
          <view class="empty" v-if="!show">
            <text>由于对方设置你无法查看TA的听歌排行</text>
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
import { userRecord } from '@/api/apis'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'RecentPlay',
  data () {
    return {
      active: 0,
			swiperActive: 0,
      uid: 0,
      allData: [],
      weekData: [],
      allDataSong: [],
      weekDataSong: [],
      loading: true,
      show: true,
      nickName: '',
      list: [{
        name: '最近一周'
      }, {
        name: '所有时间'
      }]
    }
  },
  computed: {
    ...mapGetters(['audioIngSong'])
  },
  onLoad (option) {
    this.show = true
    this.uid = option.uid * 1
    this.nickName = option.name
    this.getRecentPlay(this.uid, 1)
  },
  watch: {
    active: {
      handler (val, oldV) {
        if (val === 1) this.getRecentPlay(this.uid, '0')
      }
    }
  },
  methods: {
		...mapActions(['selectPlay']),
		tabsChange(index) {
			this.swiperActive = index
    },
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current
			this.$refs.recentplayTabs.setFinishCurrent(current)
			this.swiperActive = current
			this.active = current
    },
    setAudioList (index, songList) {
      this.selectPlay({
        list: songList,
        index
      })
    },
    getRecentPlay (uid, type) {
      userRecord(uid, type)
        .then(data => {
          if (type === 1) {
            this.weekData = data.weekData
          } else {
            this.allData = data.allData
          }
          const forData = type === 1 ? data.weekData : data.allData
          for (let i = 0; i <= forData.length - 1; i++) {
            if (type === 1) {
              this.weekDataSong[i] = forData[i].song
            } else {
              this.allDataSong[i] = forData[i].song
            }
          }
          this.$nextTick(() => {
            this.loading = false
          })
        })
        .catch(() => {
          this.show = false
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
.recentplay-tabs {
  padding-top: $height;
  .song-group {
    padding-top: 80rpx;
  }
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 32rpx;
  color: rgb(116, 113, 113);
}
</style>
