<template>
  <view class="public-sticky">
    <!-- 歌单列表 -->
    <view class="sticky-box" v-if="show">
      <loading :height="8" isabsolute :style="[{display: loading ? 'flex' : 'none'}]" />
      <view class="content-sticky" :style="[{display: !loading ? 'block' : 'none'}]">
        <!-- 顶部粘性布局 -->
        <view class="sticky-top" :style="[{top:stickyTop}]">
          <view class="on-touch" @tap="startPlay">
            <!-- 新音乐与每日推荐样式 -->
            <text class="iconfont icon-bofang1" :style="[{padding:newAndrecommed}]"></text>
            播放全部
            <text v-if="trackCount" class="trackCount">(共{{trackCount}}首)</text>
          </view>
          <!-- 收藏 -->
          <view class="favorite-btn on-touch" v-if="uid && accountUid !== uid">
            <view class="add" :style="[{display: !add ? 'block' : 'none'}]" @tap="addOrDel(true)">
              <text class="iconfont icon-jia1"></text>
              收藏({{subNum | filterPlayCountInfo}})
            </view>
            <view class="del" :style="[{display: add ? 'block' : 'none'}]" @tap="addOrDel(false)">
              <text class="iconfont icon-chuangjianwenjianjia"></text>
              {{subNum | filterPlayCountInfo}}
            </view>
          </view>
        </view>
        <!-- 为迷你播放器留空 -->
        <scroll-view
          class="song-group"
          :style="[{'padding-bottom': audioList.length ? '50px' : 0 }]"
        >
          <view class="listOne" v-if="!newSong">
            <song-list-li
              v-for="(item, index) in songList" :key="index"
              songShow
              :number="recommend ? 0 : index+1"
              :coverImgUrl="recommend ? item.al.picUrl : ''"
              :active="item.id === audioIngSong.id"
              :songid="item.id"
              :artists="item.ar"
              :albumName="item.al.name"
              :name="item.name"
              :privacy="0"
              add
              home
              @addSong="addSong"
              @playSong="setAudioList(index)"
            />
          </view>
          <!-- 新歌 -->
          <view class="listTwo" v-if="newSong">
            <song-list-li
              v-for="(item, index) in songList" :key="index"
              songShow
              :coverImgUrl="item.album.picUrl"
              :active="item.id === audioIngSong.id"
              :artists="item.artists"
              :albumName="item.album.name"
              :name="item.name"
              :privacy="0"
              home
              add
              :songid="item.id"
              @addSong="addSong"
              @playSong="setAudioList(index)"
            />
          </view>
        </scroll-view>
        <text class="finished" :style="[{display: finish ? 'flex' : 'none'}]">没有更多了</text>
      </view>
    </view>
    <!-- 歌曲为空 -->
    <view class="empty" v-if="!show">
      <button class="add-button" @tap="goIndex">添加歌曲</button>
    </view>
    <!-- 动作面板 -->
    <u-popup v-model="showActionSheet" mode="bottom" border-radius="30">
      <add-song
        :name="name"
        :uid="uid"
        :createList="createList"
        :albumId="albumId"
        :songid="songid"
        @showActionSheet="showActionSheet = false"
      />
    </u-popup>
  </view>
</template>
<script>
import Loading from '@/components/Loading'
import SongListLi from '@/components/SongListLi'
import AddSong from '@/components/AddSong'
import { mapGetters, mapActions } from 'vuex'
import { editFavoritePlayList, editFavoriteAlbum, albumDetailDynamic, playlist, userInfo } from '@/api/apis'
import { filterPlayCountInfo } from '@/common/filters'
export default {
  name: 'PubcliSticky',
  props: {
    show: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    trackCount: {
      type: Number
    },
    load: {
      type: Boolean
    },
    finish: {
      type: Boolean
    },
    songList: {
      type: Array
    },
    songListAll: {
      type: Array
    },
    // 顶部距离
    stickyTop: {
      type: String
    },
    // 新歌或每日推荐
    newAndrecommed: {
      type: String
    },
    recommend: {
      type: Boolean
    },
    newSong: {
      type: Boolean,
      default: false
    },
    // 收藏相关
    albumId: {
      type: Number
    },
    dishId: {
      type: Number
    },
    uid: {
      type: Number
    },
    subNumber: {
      type: Number
    }
  },
  data () {
    return {
      add: false,
      subNum: 0,
      showActionSheet: false,
      createList: [],
      songid: 0,
      name: ''
    }
  },
  watch: {
    uid: {
      handler (val, oldV) {
        if (val) {
          if (this.dishId !== 0) this.getSub()
          else this.subNum = this.subNumber
          if (this.loginState) {
            // 获取存储的pid
            const pid = uni.getStorageSync('favoriteId')
            const id = uni.getStorageSync('albumsId')
            // 获取收藏数
            if (this.dishId !== 0) {
              this.add = uni.getStorageSync('albumsId') ? JSON.parse(id).includes(this.dishId) : false
            } else {
              // 是否有这个歌单id 来确定 add
              this.add = uni.getStorageSync('favoriteId') ? JSON.parse(pid).includes(this.albumId) : false
            }
          }
        }
      }
    },
    '$store.state.refreshState': {
      handler (val, oldV) {
        if (this.loginState && !this.newSong) this.getUserSongNum()
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['audioIngSong', 'audioList', 'accountUid', 'loginState'])
  },
  methods: {
    ...mapActions(['selectPlay', 'startPlayAll']),
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    goIndex () {
      uni.navigateTo({
        url: '/pages/index/index',
        animationType: 'pop-in',
        animationDuration: 200
      })
    },
    setAudioList (index) {
      this.selectPlay({ list: this.songListAll, index })
    },
    startPlay () {
      this.startPlayAll({ list: this.songListAll })
    },
    // 收藏或取消收藏
    addOrDel (boolean) {
      if (this.loginState) {
        const t = boolean ? 1 : 2
        var messageEdit = ''
        // 判定歌单和专辑收藏
        if (this.albumId) {
          editFavoritePlayList(t, this.albumId)
            .then(() => {
              if (t === 1) {
                this.subNum += 1
                this.add = true
                messageEdit = '收藏成功'
              } else {
                this.subNum -= 1
                this.add = false
                messageEdit = '已取消收藏'
              }
              // 刷新
              this.$store.commit('REFRESH')
              this.toast(messageEdit)
            })
        } else {
          editFavoriteAlbum(t, this.dishId)
            .then(() => {
              if (t === 1) {
                this.subNum += 1
                this.add = true
                messageEdit = '收藏成功'
              } else {
                this.subNum -= 1
                this.add = false
                messageEdit = '已取消收藏'
              }
              // 刷新
              this.$store.commit('REFRESH')
              this.toast(messageEdit)
            })
        }
      } else {
        this.toast('需要登录')
      }
    },
    // 得到专辑收藏数
    getSub () {
      albumDetailDynamic(this.dishId)
        .then(data => {
          this.subNum = data.subCount
        })
    },
    getUserSongNum () {
      userInfo()
        .then(data => {
          // 创建的歌单数
          const createNum = data.createdPlaylistCount
          this.getPlaylist(createNum)
        })
    },
    // 获取创建列表
    getPlaylist (createNum) {
      playlist(this.accountUid)
        .then(data => {
          this.createList = data.playlist.slice(0, createNum)
        })
    },
    // 显示动作面板
    addSong (data) {
      this.showActionSheet = true
      this.songid = data.songid
      this.name = data.name
    }
  },
  filters: {
    filterPlayCountInfo
  },
  components: {
    Loading,
    SongListLi,
    AddSong
  }
}
</script>
<style lang='scss' scoped>
.public-sticky {
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
}
.sticky-box {
  position: absolute;
  top: 460rpx;
  width: $width;
  border-radius: 40rpx 40rpx 0 0;
  background-color: #fff;
  .sticky-top {
    position: sticky;
    /* #ifdef APP-PLUS */
    top: 10rpx;
    /* #endif */
    /* #ifndef APP-PLUS */
    top: 0;
    /* #endif */
    z-index: 6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    border-radius: 40rpx 40rpx 0 0;
    background-color: #fff;
    overflow: hidden;
    .on-touch {
      display: flex;
      align-items: center;
      height: 100rpx;
    }
    .icon-bofang1 {
      padding: 0 30rpx 0 40rpx;
      font-size: 32rpx;
    }
    .trackCount {
      font-size: 26rpx;
      color: rgb(151, 149, 149);
    }
    .favorite-btn {
      padding-right: 30rpx;
      .add {
        height: 80rpx;
        line-height: 80rpx;
        padding: 0 20rpx;
        color: #fff;
        background-color: $defaultColor;
        border-radius: 40rpx;
        font-size: 24rpx;
        .iconfont {
          font-size: 20rpx;
        }
      }
      .del {
        color: rgb(172, 172, 172);
        .iconfont {
          font-size: 26rpx;
        }
      }
    }
  }
  .song-group {
    background-color: #fff;
  }
}
.empty {
  position: absolute;
  top: 480rpx;
  width: $width;
  text-align: center;
  border-radius: 40rpx 40rpx 0 0;
  background-color: #fff;
  .add-button {
    width: $width*0.5;
    height: 80rpx;
    line-height: 80rpx;
    color: $defaultColor;
    background-color: transparent;
    border: 1rpx solid $defaultColor;
    border-radius: 40rpx;
    &:active {
      color: #fff;
      background-color: $defaultColor;
      border: none;
    }
  }
}
</style>
