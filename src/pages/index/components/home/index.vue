<template>
	<view class="home-container">
		<home-icons />
		<home-apply
			:dj="dj"
			:favorite="favoritArtis + albumsCount + videosCount"
		/>
		<home-song-list
			:songListNum="songListNum"
			@reload="getUserInfo"
		/>
	</view>
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
        }
      },
      immediate: true
    },
    // 暂时没有对视频进行操作,只监听用户id就行
    '$store.state.accountUid': {
      handler () {
        if (this.loginState) {
          this.getVideos()
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['loginState'])
  },
  methods: {
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
        .catch(() => {
          this.$toast('请求失败,请稍后尝试')
        })
    },
    getAlbums () {
      favoriteAlbums()
        .then(data => {
          this.albumsCount = data.count
        })
        .catch(() => {
          this.$toast('获取专辑失败')
        })
    },
    getVideos () {
      favoriteVideos()
        .then(data => {
          this.videosCount = data.count
        })
        .catch(() => {
          this.$toast('获取视频失败')
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

</style>
