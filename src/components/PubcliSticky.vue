<template>
  <div class="public-sticky">
    <!-- 歌单列表 -->
    <div class="sticky-box" :style="{top}" v-if="show">
      <loading :height="4.35" isabsolute v-show="loading" />
      <div class="content-sticky" v-show="!loading">
        <!-- 顶部粘性布局 -->
        <div class="sticky-top" :style="{top:stickyTop}">
          <span class="on-touch" @click="startPlay">
            <!-- 新音乐与每日推荐样式 -->
            <i class="iconfont icon-bofang1" :style="{padding:newAndrecommed}"></i>
            播放全部
            <span v-if="trackCount" class="trackCount">(共{{trackCount}}首)</span>
          </span>
          <!-- 收藏 -->
          <div class="favorite-btn on-touch" v-if="uid && accountUid !== uid">
            <span class="add" v-show="!add" @click="addOrDel(true)">
              <i class="iconfont icon-jia1"></i>
              收藏({{subNum | filterPlayCountInfo}})
            </span>
            <span class="del" v-show="add" @click="addOrDel(false)">
              <i class="iconfont icon-chuangjianwenjianjia"></i>
              {{subNum | filterPlayCountInfo}}
            </span>
          </div>
        </div>
        <!-- 为迷你播放器留空 -->
        <ul
          class="song-group"
          :style="{'padding-bottom': audioList.length ? '1rem' : 0 }"
        >
          <!-- 瀑布流加载 -->
          <van-list
            v-model="reload"
            :finished="finish"
            finished-text="没有更多了"
            :offset="10"
            @load="reLoad"
          >
            <div class="listOne" v-if="!newSong">
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
            </div>
            <!-- 新歌 -->
            <div class="listTwo" v-if="newSong">
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
            </div>
          </van-list>
        </ul>
      </div>
    </div>
    <!-- 歌曲为空 -->
    <div class="empty" v-if="!show">
      <button class="add-button" @click="$router.push('/find')">添加歌曲</button>
    </div>
    <!-- 动作面板 -->
    <van-action-sheet v-model="showActionSheet" close-on-popstate>
      <add-song
        :name="name"
        :uid="uid"
        :createList="createList"
        :albumId="albumId"
        :songid="songid"
        :showActionSheet.sync="showActionSheet"
      />
    </van-action-sheet>
  </div>
</template>
<script>
import Loading from 'components/Loading'
import SongListLi from 'components/SongListLi'
import AddSong from 'components/AddSong'
import { mapGetters, mapActions } from 'vuex'
import { editFavoritePlayList, editFavoriteAlbum, albumDetailDynamic, playlist, userInfo } from 'api/apis'
import { filterPlayCountInfo } from 'utils/filters'
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
    // 瀑布流加载
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
    top: {
      type: String,
      default: '5.9rem'
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
      reload: false,
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
        if (this.dishId !== 0) this.getSub()
        else this.subNum = this.subNumber
        if (this.loginState) {
          // 获取存储的pid
          const pid = JSON.parse(localStorage.getItem('favoriteId'))
          const id = JSON.parse(localStorage.getItem('albumsId'))
          // 获取收藏数
          if (this.dishId !== 0) {
            this.add = localStorage.getItem('albumsId') ? id.includes(this.dishId) : false
          } else {
            // 是否有这个歌单id 来确定 add
            this.add = localStorage.getItem('favoriteId') ? pid.includes(this.albumId) : false
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
    setAudioList (index) {
      this.selectPlay({ list: this.songListAll, index })
    },
    startPlay () {
      this.startPlayAll({ list: this.songListAll })
    },
    reLoad () {
      this.$nextTick(() => {
        this.reload = this.load
      })
      this.$emit('reLoad')
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
              this.$toast(messageEdit)
            })
            .catch(() => {
              this.$toast('歌单收藏操作失败')
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
              this.$toast(messageEdit)
            })
            .catch(() => {
              this.$toast('歌单收藏操作失败')
            })
        }
      } else {
        this.$toast('需要登录')
      }
    },
    // 得到专辑收藏数
    getSub () {
      albumDetailDynamic(this.dishId)
        .then(data => {
          this.subNum = data.subCount
        })
        .catch(() => {
          this.$toast('获取专辑收藏数')
        })
    },
    getUserSongNum () {
      userInfo()
        .then(data => {
          // 创建的歌单数
          const createNum = data.createdPlaylistCount
          this.getPlaylist(createNum)
        })
        .catch(() => {
          this.$toast('请求失败,请稍后尝试')
        })
    },
    // 获取创建列表
    getPlaylist (createNum) {
      playlist(this.accountUid)
        .then(data => {
          this.createList = data.playlist.slice(0, createNum)
        })
        .catch(() => {
          this.$toast('请求失败,请稍后尝试')
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
.sticky-box {
  position: absolute;
  top: 5.9rem;
  width: 100%;
  border-radius: .4rem .4rem 0 0;
  background-color: #fff;
  .sticky-top {
    position: sticky;
    top: 1.2rem;
    z-index: 6;
    display: flex;
    justify-content: space-between;
    height: 1rem;
    line-height: 1rem;
    border-radius: .4rem .4rem 0 0;
    background-color: #fff;
    overflow: hidden;
    .icon-bofang1 {
      padding: 0 .3rem 0 .4rem;
      font-size: .32rem;
    }
    .trackCount {
      font-size: .26rem;
      color: rgb(151, 149, 149);
    }
    .favorite-btn {
      padding-right: .3rem;
      .add {
        color: #fff;
        background-color: #dd001b;
        padding: .2rem;
        border-radius: .4rem;
        font-size: .24rem;
        i {
          font-size: .2rem;
        }
      }
      .del {
        color: rgb(172, 172, 172);
        i {
          font-size: .26rem;
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
  top: 5.9rem;
  width: 100%;
  padding-top: 2rem;
  text-align: center;
  border-radius: 0.4rem 0.4rem 0 0;
  background-color: #fff;
  .add-button {
    width: 50vw;
    height: .8rem;
    color: #dd001b;
    background-color: transparent;
    border: 0.01rem solid #dd001b;
    border-radius: 0.4rem;
    &:active {
      color: #fff;
      background-color: #dd001b;
      border: none;
    }
  }
}
</style>
