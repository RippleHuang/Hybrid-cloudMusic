<template>
  <scroll-view scroll-y class="find-page">
		<SwiperImage />
		<findIcons />
		<song-list :songList="songList" />
    <new-plate />
	</scroll-view>
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
  data () {
    return {
      isLoading: false,
      songList: []
    }
  },
  created () {
		// this.judge()
		this.getSongList()
  },
  methods: {
    // 刷新
    onRefresh () {
      this.judge()
    },
    // 判断请求什么数据
    judge () {
      if (this.loginState) {
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
          this.$nextTick(() => {
            this.isLoading = false
          })
				})
			console.log('a')
    },
    // 已登录
    getRecSong () {
      loginRecSongList()
        .then(data => {
          this.songList = getRandomNumberArray(data.recommend, 6)
          this.$nextTick(() => {
            this.isLoading = false
          })
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

</style>