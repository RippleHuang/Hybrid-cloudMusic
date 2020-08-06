<template>
  <view class="result-all-type">
    <!-- 单曲 -->
    <view class="title" v-if="typeData.song">
      单曲
      <view class="play" @tap="$store.dispatch('startPlayAll', { list: typeData.song })">
        <text class="iconfont icon-bofang1"></text>
        播放全部
      </view>
    </view>
    <view class="song-group">
      <song-list-li
        v-for="(item, index) in typeData.song" :key="index"
        songShow
        :number="index+1"
        :active="item.id === audioIngSong.id"
        :artists="item.ar"
        :albumName="item.al.name"
        :name="item.name"
        :privacy="0"
        home
        @playSong="$store.dispatch('addToAudioList', item)"
      />
    </view>
    <view class="more on-touch" v-if="typeData.songText" @tap="moreList(1)">{{typeData.songText}}&nbsp;&gt;</view>
    <!-- 歌单 -->
    <view class="title" v-if="typeData.playList">歌单</view>
    <view class="song-group">
      <song-list-li
        v-for="(item, index) in typeData.playList" :key="index"
        :coverImgUrl="item.coverImgUrl"
        :name="item.name"
        :trackCount="item.trackCount"
        :creatorNickname="item.creator.nickname"
        userInfo
        :privacy="0"
        :playCount="item.playCount"
        @tap.native="$router.push(`/showsong?albumId=${item.id}`)"
      />
    </view>
    <view class="more on-touch" v-if="typeData.playListText" @tap="moreList(5)">{{typeData.playListText}}&nbsp;&gt;</view>
    <!-- 视频 -->
    <view class="title" v-if="typeData.video">视频</view>
    <video-list
      :data="typeData.video"
      search
    />
    <view class="more on-touch" v-if="typeData.videoText" @tap="moreList(2)">{{typeData.videoText}}&nbsp;&gt;</view>
    <!-- 相关搜索 -->
    <view class="title" v-if="typeData.sim_query">相关搜索</view>
    <view class="sim-query">
      <text
        class="sim-keyword"
        v-for="(item, index) in typeData.sim_query" :key="index"
        @tap="searchSim(item.keyword)"
      >
      {{item.keyword}}
      </text>
    </view>
    <!-- 歌手 -->
    <view class="title" v-if="typeData.artist">歌手</view>
    <artists-or-user
      :data="typeData.artist"
      songer
    />
    <view class="more on-touch" v-if="typeData.artistText" @tap="moreList(3)">{{typeData.artistText}}&nbsp;&gt;</view>
    <!-- 专辑 -->
    <view class="title" v-if="typeData.album">专辑</view>
    <view class="song-group">
      <song-list-li
        v-for="(item, index) in typeData.album" :key="index"
        :coverImgUrl="item.picUrl"
        :name="item.name"
        :artists="item.artists"
        :trackCount="item.size"
        :publishTime="item.publishTime"
        :privacy="0"
        :id="item.id"
        @tap.native="$router.push(`/showsong?dishId=${item.id}`)"
      />
    </view>
    <view class="more on-touch" v-if="typeData.albumText" @tap="moreList(4)">{{typeData.albumText}}&nbsp;&gt;</view>
    <!-- 用户 -->
    <view class="title" v-if="typeData.user">用户</view>
    <artists-or-user
      :data="typeData.user"
      user
    />
    <view class="more on-touch" v-if="typeData.userText" @tap="moreList(6)">{{typeData.userText}}&nbsp;&gt;</view>
  </view>
</template>
<script>
import { mapGetters } from 'vuex'
import SongListLi from '@/components/SongListLi'
import ArtistsOrUser from '@/components/ArtistsOrUser'
import VideoList from '@/components/VideoList'
export default {
  name: 'ResultAllType',
  props: ['resultData'],
  data () {
    return {
      typeData: {}
    }
  },
  watch: {
    resultData: {
      handler (val, oldV) {
        if (JSON.stringify(val) !== '{}') {
          const array = val.order ? val.order : []
          const dataName = array.map(item => item)
          dataName.splice(4, 2)
          // 添加新属性
          for (let index = 0; index < dataName.length; index++) {
            this.$set(this.typeData, dataName[index], {})
            this.$set(this.typeData, dataName[index] + 'Text', '')
            // 对应数据不为空
            if (JSON.stringify(val[dataName[index]]) !== '{}') {
              this.typeData[dataName[index]] = val[dataName[index]][dataName[index] + 's']
              this.typeData[dataName[index] + 'Text'] = val[dataName[index]]['moreText']
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['audioIngSong'])
  },
  methods: {
    moreList (active) {
      this.$emit('changeActive', active)
    },
    searchSim (keyword) {
      // 保存搜索历史
      this.$store.commit('SET_HISTORY', keyword)
      this.$emit('searchSim', keyword)
    }
  },
  components: {
    SongListLi,
    ArtistsOrUser,
    VideoList
  }
}
</script>
<style lang='scss' scoped>
.result-all-type {
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 28rpx;
    height: 100rpx;
    font-size: 38rpx;
    font-weight: bold;
    .play {
      padding: 10rpx 15rpx;
      line-height: 32rpx;
      border: 1rpx solid #eee;
      border-radius: 30rpx;
      font-size: 24rpx;
      font-weight: 500;
      box-sizing: border-box;
      &:active {
        background-color: rgba(0, 0, 0, .1);
      }
    }
    .icon-bofang1 {
      padding-right: 10rpx;
      font-size: 24rpx;
    }
  }
  .sim-query {
    display: flex;
    flex-wrap: wrap;
    padding: 0 30rpx 20rpx;
    .sim-keyword {
      height: 60rpx;
      padding: 0 20rpx;
      margin: 30rpx 30rpx 0 0;
      line-height: 60rpx;
      text-align: center;
      color: black;
      background-color: rgb(236, 231, 231);
      border-radius: 30rpx;
    }
  }
  .more {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    color: rgb(65, 62, 62);
  }
}
</style>
