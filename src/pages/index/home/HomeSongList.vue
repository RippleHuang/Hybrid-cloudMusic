<template>
  <view class="list-container">
    <u-collapse class="song-list-con" hover-class="none" :accordion="false">
      <!-- 创建的歌单 -->
      <u-collapse-item @change="changeActive" :index="0" class="song-list-item">
        <!-- 标题 -->
        <template slot="title-all">
          <view class="title-all on-touch">
            <view class="left-title">
              <text class="iconfont" :class="oneArrow"></text>
              <text class="title">创建的歌单</text>
              <text class="num">({{songListNum.createNum}})</text>
            </view>
            <!-- 右边按钮图标 -->
            <!-- 阻止冒泡 -->
            <view class="right-icons" @tap.stop>
              <text class="iconfont icon-jia1 on-touch" @tap="createSongList"></text>
              <text class="iconfont icon-sandian on-touch" @tap="activeButton(1)"></text>
            </view>
          </view>
        </template>
        <!-- 歌单列表 -->
        <!-- 没登录的情况下列表项显示 -->
        <scroll-view scroll-y class="song-group" :style="[{display: !loginState ? 'flex' : 'none'}]">
          <view class="song-list" @tap="toast('需要登录')">
            <view class="left">
              <view class="list-cover">
                <view class="bgc">
                  <text class="iconfont icon-xindong2"></text>
                </view>
              </view>
              <view class="list-info home-info">
                <p class="list-title">我喜欢的音乐</p>
                <p class="list-num">0首</p>
              </view>
            </view>
            <view class="heart-module">
              <button class="title-btn" @tap.stop="toast('需要登录')">
                <text class="iconfont icon-xindong"></text>心动模式
              </button>
            </view>
          </view>
        </scroll-view>
        <!-- 登录的情况下列表项显示 -->
        <scroll-view scroll-y class="song-group" v-if="createList.length > 0 || myLoveList.length > 0">
          <!-- 我喜欢的音乐 -->
          <song-list-li
            v-if="myLoveList[0] != null"
            :coverImgUrl="myLoveList[0].coverImgUrl"
            :name="myLoveList[0].name"
            :trackCount="myLoveList[0].trackCount"
            :privacy="myLoveList[0].privacy"
            myLove
            home
            :songListId="myLoveList[0].id"
            @eventThing="goSongShow(myLoveList[0].id)"
          />
          <song-list-li
            v-for="(item, index) in createList" :key="index"
            :coverImgUrl="item.coverImgUrl"
            :name="item.name"
            :trackCount="item.trackCount"
            :privacy="item.privacy"
            :description="item.description"
            :songListId="item.id"
            home
            showActionSheet
            @showAction="showAction"
            @eventThing="goSongShow(item.id)"
          />
        </scroll-view>
      </u-collapse-item>
      <!-- 收藏的歌单 -->
      <!-- 有收藏的情况下才显示 -->
      <u-collapse-item v-if="favoritesList.length > 0" :index="1" class="song-list-item" @change="changeActive">
        <!-- 标题 -->
        <template slot="title-all">
          <view class="title-all on-touch">
            <view class="left-title">
              <text class="iconfont" :class="twoArrow"></text>
              <text class="title">收藏的歌单</text>
              <text class="num">({{songListNum.favoritesNum}})</text>
            </view>
            <!-- 右边按钮图标 -->
            <!-- 阻止冒泡 -->
            <view class="right-icon" @tap.stop>
              <text class="iconfont icon-sandian on-touch" @tap="activeButton(2)"></text>
            </view>
          </view>
        </template>
        <!-- 歌单列表 -->
        <scroll-view scroll-y class="song-group">
          <song-list-li
            v-for="(item, index) in favoritesList" :key="index"
            :coverImgUrl="item.coverImgUrl"
            :name="item.name"
            :trackCount="item.trackCount"
            :creatorNickname="item.creator.nickname"
            :privacy="item.privacy"
            :description="item.description"
            :songListId="item.id"
            home
            noCompile
            showActionSheet
            @showAction="showAction"
            @eventThing="goSongShow(item.id)"
          />
        </scroll-view>
      </u-collapse-item>
    </u-collapse>
  </view>
</template>
<script>
import { playlist } from '@/api/apis'
import SongListLi from '@/components/SongListLi'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeSongList',
  props: {
    songListNum: {
      type: Object
    }
  },
  data () {
    return {
      // 创建歌单与收藏歌单箭头
      activeArrow: {
        oneShow: false,
        twoShow: false
      },
      // 收藏歌单详情
      favoritesList: [],
      // 创建歌单详情
      createList: [],
      // 我的喜欢歌单
      myLoveList: []
    }
  },
  computed: {
    ...mapGetters(['accountUid', 'loginState']),
    oneArrow: function () {
      return this.activeArrow.oneShow ? 'icon-arrow-down' : 'icon-arrow-right'
    },
    twoArrow: function () {
      return this.activeArrow.twoShow ? 'icon-arrow-down' : 'icon-arrow-right'
    },
  },
  watch: {
    '$store.state.refreshState': {
      handler (val, oldVal) {
        if (this.loginState) {
          this.getPlaylist(this.accountUid)
        }
      },
      immediate: true
    },
    loginState: {
      handler (val, oldV) {
        if (!val) {
          this.favoritesList = []
        }
      }
    }
  },
  methods: {
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    goSongShow (id) {
      uni.navigateTo({
				url: `/otherPages/showsong/showSongList?albumId=${id}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    changeActive (data) {
      if (data.index === 0) this.activeArrow.oneShow = data.show
      else this.activeArrow.twoShow = data.show
    },
    // 激活相应动作面板
    activeButton (data) {
      if (this.loginState) {
        this.$emit('listShow', {
          showAction: true,
          active: data
        })
      } else {
        this.toast('需要登录')
      }
    },
    // 激活歌单列表动作面板
    showAction (data) {
      this.$emit('songListShow', {
        showAction: true,
        active: 3,
        uid: data.id,
        title: data.name,
        description: data.description,
        compile: data.noCompile
      })
    },
    getPlaylist (id) {
      playlist(id)
        .then(data => {
          this.sliceInfo(data.playlist)
        })
    },
    // 分割歌单
    sliceInfo (arr) {
      const create = this.songListNum.createNum
      const favorites = this.songListNum.createNum + this.songListNum.favoritesNum
      const SongListCreate = arr.slice(0, create)
      this.myLoveList = SongListCreate.slice(0, 1)
      this.createList = SongListCreate.slice(1)
      this.favoritesList = arr.slice(create, favorites)
      // 保存收藏歌单的id
      // 有本地数据先清空
      if (uni.getStorageSync('favoriteId')) uni.removeStorageSync('favoriteId')
      const favoritesPid = []
      this.favoritesList.forEach(element => {
        favoritesPid.push(element.id)
      })
      // 保存
      uni.setStorageSync('favoriteId', JSON.stringify(favoritesPid))
    },
    // 激活模态框
    createSongList () {
      if (!this.loginState) {
        this.toast('需要登录')
      } else {
        this.$emit('modelShow', {
          showDialog: true,
          showAction: false
        })
      }
    }
  },
  components: {
    SongListLi
  }
}
</script>
<style lang='scss' scoped>
$songListHeight: 90rpx;
.list-container {
  display: flex;
  .song-list-con {
    display: flex;
    flex-direction: column;
    width: $width;
    // 歌单
    .song-list-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: $width;
      .title-all {
        display: flex;
        justify-content: space-between;
        width: $width;
      }
      // 标题及右图标
      .left-title {
        display: flex;
        align-items: center;
        height: $songListHeight;
        margin-left: 32rpx;
        text {
          height: $songListHeight;
          line-height: $songListHeight;
          font-size: 48rpx;
          text-align: center;
        }
        .title {
          font-size: 33rpx;
          font-weight: bold;
        }
        .num {
          margin-left: 10rpx;
          font-size: 28rpx;
          color: rgba(0, 0, 0, .4);
        }
      }
      .right-icons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: .25;
        height: $songListHeight;
        padding-right: 20rpx;
        text {
          flex: 1;
          height: $songListHeight;
          margin-right: 20rpx;
          line-height: $songListHeight;
          text-align: center;
          font-size: 33rpx;
        }
      }
      // 收藏歌单右侧按钮
      .right-icon {
        @extend .right-icons;
        flex: .12;
      }
    }
  }
}
.first {
  width: 300rpx;
}
</style>
