<template>
  <view class="find-page">
		<SwiperImage />
		<findIcons />
		<song-list :songList="songList" />
    <new-plate />
	</view>
</template>
<script>
import SwiperImage from './Swiper'
import FindIcons from './FindIcons'
import SongList from './SongList'
import NewPlate from './NewPlate'
import { recSongList, loginRecSongList } from '@/api/apis'
import { getRandomNumberArray } from '@/common/randomNumberArray'
export default {
  name: 'FindIndex',
  props: {
    refresh: {
      type: Number
    }
  },
  data () {
    return {
      songList: []
    }
  },
  created () {
    this.judge()
  },
  watch: {
    refresh (val, oldV) {
      this.judge()
      this.toast('以为你推荐新的内容')
    }
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    // 判断请求什么数据
    judge () {
      if (this.$store.state.loginState) {
        this.getRecSong()
      } else {
        this.getSongList()
      }
    },
    // 未登录
    getSongList () {
      // 取出数量
      const limit = 10
      recSongList(limit)
        .then(data => {
          this.songList = getRandomNumberArray(data.playlists, 6)
				})
    },
    // 已登录
    getRecSong () {
      loginRecSongList()
        .then(data => {
          this.songList = getRandomNumberArray(data.recommend, 6)
        })
    }
  },
  components: {
    SwiperImage,
    FindIcons,
    SongList,
    NewPlate
  }
}
</script>
<style lang="scss" scoped>
.find-page {
  /* #ifdef APP-PLUS */
	padding-top: var(--status-bar-height);
  /* #endif */
  width: $width;
}
</style>