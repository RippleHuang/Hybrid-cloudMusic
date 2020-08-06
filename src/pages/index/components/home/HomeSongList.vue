<template>
  <view class="container">
    <u-collapse class="song-list-con" hover-class="none" :accordion="false">
      <!-- 创建的歌单 -->
      <u-collapse-item @change="changeActive" :open="true" index="1" class="song-list-item">
        <!-- 标题 -->
        <template #title-all>
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
        <view class="song-group" v-if="!$store.state.loginState">
          <view class="song-list" @tap="$toast('需要登录')">
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
              <button class="title-btn" @tap.stop="$toast('需要登录')">
                <text class="iconfont icon-xindong"></text>心动模式
              </button>
            </view>
          </view>
        </view>
        <!-- 登录的情况下列表项显示 -->
        <view class="song-group" v-if="$store.state.loginState">
          <!-- 我喜欢的音乐 -->
          <song-list-view
            v-for="(item, index) in myLoveList" :key="index"
            :coverImgUrl="item.coverImgUrl"
            :name="item.name"
            :trackCount="item.trackCount"
            :privacy="item.privacy"
            myLove
            home
            :id="item.id"
            @getHeartMode="getHeartMode"
            @tap.native="$router.push(`/showsong?albumId=${item.id}`)"
          />
          <!-- 由于我喜欢的音乐占了一个,索引+1 -->
          <song-list-view
            v-for="(item, index) in createList" :key="index+1"
            :coverImgUrl="item.coverImgUrl"
            :name="item.name"
            :trackCount="item.trackCount"
            :privacy="item.privacy"
            :description="item.description"
            :id="item.id"
            home
            showActionSheet
            @showAction="showAction"
            @tap.native="$router.push(`/showsong?albumId=${item.id}`)"
          />
        </view>
      </u-collapse-item>
      <!-- 收藏的歌单 -->
      <!-- 有收藏的情况下才显示 -->
      <u-collapse-item v-if="favoritesList.length > 0" index="2" class="song-list-item" @change="changeActive">
        <!-- 标题 -->
        <template #title-all>
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
        </template>
        <!-- 歌单列表 -->
        <view class="song-group">
          <song-list-view
            v-for="(item, index) in favoritesList" :key="index"
            :coverImgUrl="item.coverImgUrl"
            :name="item.name"
            :trackCount="item.trackCount"
            :creatorNickname="item.creator.nickname"
            :privacy="item.privacy"
            :description="item.description"
            :id="item.id"
            home
            noCompile
            showActionSheet
            @showAction="showAction"
            @tap.native="$router.push(`/showsong?albumId=${item.id}`)"
          />
        </view>
      </u-collapse-item>
    </u-collapse>
    <!-- 模态框 -->
    <u-modal v-model="showModel" :mask-close-able="true" content="确认删除当前歌单？" @confirm="deleteSongList"></u-modal>
    <!-- 动作面板 -->
    <u-popup v-model="show" mode="bottom" border-radius="30">
      <view v-if="active === 1">
        <view class="top on-touch">创建的歌单</view>
        <home-for :icons="createAction" @createSongList="createSongList" :height="0.8" />
      </view>
      <view v-if="active === 2">
        <view class="top on-touch">收藏的歌单</view>
        <home-for :icons="favoriteAction" :height="0.8" />
      </view>
      <view v-if="active === 3">
        <view class="top on-touch van-ellipsis">歌单: {{title}}</view>
        <home-for
          :icons="compile ? songListTwo : songListAction"
          :height="0.8"
          :uid="uid"
          :title="title"
          :description="description"
          @deleteSongList="showModel = true"
        />
      </view>
    </u-popup>
    <!-- 弹出框 -->
    <u-modal
      v-model="showDialog"
      title="新建歌单"
      @confirm="addSongList"
    >
      <u-field
        v-model="name"
        maxlength="40"
        label="名称"
        placeholder="请输入歌单标题"
        clearable
      >
      </u-field>
      <u-checkbox v-model="checked" shape="square" active-color="#dd001b">设置为隐私歌单</u-checkbox>
    </u-modal>
  </view>
</template>
<script>
import { playlist, playlistAdd, playlistDelete } from '@/api/apis'
import SongListLi from '@/components/SongListLi'
import HomeFor from '@/components/HomeFor'
import { mapGetters } from 'vuex'
import { CreateAction, SongListAction } from '@/common/icons'
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
        oneShow: true,
        twoShow: false
      },
      showModel: false,
      // 收藏歌单详情
      favoritesList: [],
      // 创建歌单详情
      createList: [],
      // 我的喜欢歌单
      myLoveList: [],
      // 动作面板
      show: false,
      createAction: [],
      favoriteAction: [{
        text: '歌单管理',
        icon: 'iconfont icon-liebiaoguanli',
        event: 'no'
      }],
      songListAction: [],
      songListTwo: [],
      compile: false,
      active: 0,
      uid: 0,
      title: '',
      description: '',
      // 弹出框
      showDialog: false,
      name: '',
      checked: false
    }
  },
  mounted () {
    this.initData()
    const songListTwo = SongListAction().map(item => item)
    songListTwo.splice(2, 1)
    this.songListTwo = songListTwo
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
    }
  },
  methods: {
    // 初始化图标
    initData () {
      this.createAction = CreateAction()
      this.songListAction = SongListAction()
    },
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    changeActive (data) {
      if (data.index === '1') this.activeArrow.oneShow = data.show
      else this.activeArrow.twoShow = data.show
    },
    // 激活相应动作面板
    activeButton (data) {
      if (this.loginState) {
        this.show = true
        this.active = data
      } else {
        this.toast('需要登录')
      }
    },
    // 激活歌单列表动作面板
    showAction (data) {
      this.show = true
      this.active = 3
      this.uid = data.id
      this.title = data.name
      this.description = data.description
      this.compile = data.noCompile
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
        this.showDialog = true
        this.show = false
      }
    },
    // 删除歌单
    deleteSongList () {
      this.show = false
      playlistDelete(this.uid)
        .then(() => {
          this.toast('删除成功')
          // 重新获取
          this.getPlaylist(this.accountUid)
          this.$emit('reload')
        })
    },
    // 添加歌单
    addSongList () {
      if (this.name === '') {
        this.toast('歌单名不能为空')
        return
      }
      const privacy = this.checked ? 10 : 0
      playlistAdd(this.name, privacy)
        .then(() => {
          this.toast('添加成功')
          // 重新获取
          this.getPlaylist(this.accountUid)
          this.$emit('reload')
        })
    }
  },
  components: {
    SongListLi,
    HomeFor
  }
}
</script>
<style lang='scss' scoped>
$songListHeight: 90rpx;
.container {
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
          line-height: $songListHeight;
          text-align: center;
          font-size: 33rpx;
        }
      }
      // 收藏歌单右侧按钮
      .right-icon {
        @extend .right-icons;
        flex: .111;
      }
    }
  }
  .top {
    height: 80rpx;
    padding-left: 20rpx;
    line-height: 80rpx;
    border-bottom: 1px solid #eee;
    color: rgb(99, 96, 96);
  }
}
.first {
  width: 300rpx;
}
</style>
