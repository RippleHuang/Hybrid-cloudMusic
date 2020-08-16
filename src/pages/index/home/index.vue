<template>
	<scroll-view class="home-container">
		<home-icons />
		<home-apply
			:dj="dj"
			:favorite="favoritArtis + albumsCount + videosCount"
		/>
		<home-song-list
			:songListNum="songListNum"
      @listShow="list"
      @songListShow="songlist"
      @modelShow="model"
		/>
	</scroll-view>
</template>
<script>
import HomeIcons from './HomeIcons'
import HomeApply from './HomeApply'
import HomeSongList from './HomeSongList'
import { userInfo, favoriteAlbums, favoriteVideos } from '@/api/apis'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeIndex',
  data () {
    return {
      songListNum: {
        // 创建的歌单
        createNum: 0,
        // 收藏的歌单
        favoritesNum: 0
      },
      heartModeList: [],
      favoritArtis: 0,
      dj: 0,
      albumsCount: 0,
      videosCount: 0
    }
  },
  /* 监听refreshState变化 */
  watch: {
    '$store.state.refreshState': {
      handler (val, oldVal) {
        if (this.loginState) {
          this.getUserInfo()
          this.getAlbums()
          this.getVideos()
        }
      },
      immediate: true
    },
    loginState: {
      handler (val, oldV) {
        if (!val) {
          this.songListNum.createNum = 0
          this.songListNum.favoritesNum = 0
        }
      }
    }
  },
  computed: {
    ...mapGetters(['loginState'])
  },
  methods: {
    list (data) {
      this.$emit('list', data)
    },
    songlist (data) {
      this.$emit('songlist', data)
    },
    model (data) {
      this.$emit('model', data)
    },
    // 获取用户信息
    getUserInfo () {
      userInfo()
        .then(data => {
          // 创建的歌单数
          this.songListNum.createNum = data.createdPlaylistCount
          // 收藏的歌单数
          this.songListNum.favoritesNum = data.subPlaylistCount
          // 收藏的歌手数
          this.favoritArtis = data.artistCount
          // 收藏的电台数
          this.dj = data.djRadioCount
        })
    },
    getAlbums () {
      favoriteAlbums()
        .then(data => {
          this.albumsCount = data.count
        })
    },
    getVideos () {
      favoriteVideos()
        .then(data => {
          this.videosCount = data.count
        })
    }
  },
  components: {
    HomeIcons,
    HomeApply,
    HomeSongList
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  /* #ifdef APP-PLUS */
	padding-top: var(--status-bar-height);
  /* #endif */
}
</style>
