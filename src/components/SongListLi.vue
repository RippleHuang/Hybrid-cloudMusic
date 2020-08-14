<template>
  <view class="song-list"  @tap="eventThing">
    <view class="left">
      <!-- 歌单 -->
      <view class="list-cover" v-if="!songShow">
        <!-- 图片地址加上 ?param=数字y数字 可以控制尺寸 -->
        <image :src="coverImgUrl + '?param=80y80'" alt="" />
        <view v-if="privacy !== 0" class="mask"></view>
        <text :style="[{ bottom: `${bottom*50}px` }]" class="iconfont icon-icon-system-fn-lock" v-if="privacy !== 0"></text>
      </view>
      <!-- 歌曲 -->
      <view class="list-cover" :class="[{'number-show': number, imge: coverImgUrl}]" v-if="songShow">
        <text v-if="!active && number" class="number">{{number}}</text>
        <image class="song-img" v-else-if="!active && coverImgUrl" :src="coverImgUrl + '?param=50y50'" alt="" />
        <text v-else class="iconfont icon-yinliang"></text>
      </view>
      <!-- 歌单 -->
      <view class="list-info" v-if="!songShow">
        <!-- 默认会显示用户姓名,需要替换 我喜欢的音乐样式调整 -->
        <text
          class="list-title u-line-1"
          :style="[{width: userInfo ? '75vw' : myLove ? '150px' : '240px'}]"
        >
          {{myLove ? '我喜欢的音乐': name}}
        </text>
        <text class="list-num u-line-1" :style="[{width: userInfo ? '75vw' : myLove ? '150px' : '240px'}]">
          <!-- 专辑,歌单 -->
          <text class="artist" v-for="(item, index) in artists" :key="index">{{item.name}}</text>
          <text>{{trackCount}}首</text>
          <text class="text" v-if="publishTime">{{publishTime | format}}</text>
          <text class="text" v-if="creatorNickname">，by{{creatorNickname}}</text>
          <text class="text" v-if="playCount > 0">，播放{{playCount | filterPlayCountInfo }}次</text>
        </text>
      </view>
      <!-- 歌曲 -->
      <view class="list-info" @tap="playSong" v-if="songShow">
        <!-- 不添加 v-if 会影响其他 -->
        <text class="list-title u-line-1"
          :style="[{width: songplayCount ? '65vw' : number ? '75vw' : '67vw'}]"
          v-if="songShow"
        >
        {{name}}
        </text>
        <text class="list-num u-line-1"
          :style="[{width: songplayCount ? '65vw' : number ? '75vw' : '67vw'}]"
          v-if="songShow"
        >
          <text class="artist" v-for="(item, index) in artists" :key="index">{{ item.name }}</text>
          <text class="album-name">{{ albumName }}</text>
        </text>
      </view>
    </view>
    <view class="compile" v-if="home" :style="[{flex: songplayCount ? 0.8 : 0.32 }]">
      <button v-if="myLove" class="title-btn" round type="info" @tap.stop="heartMode">
        <text class="iconfont icon-xindong"></text>心动模式
      </button>
      <text v-else-if="songplayCount">
        <text class="iconfont icon-bofang1"></text>{{songplayCount}}次
      </text>
      <text v-else-if="showActionSheet" class="iconfont icon-sandian on-touch" @tap.stop="showAction"></text>
      <text v-else-if="add" class="iconfont icon-sandian on-touch"  @tap.stop="addSong"></text>
      <text v-else class="iconfont icon-sandian on-touch"  @tap.stop="no"></text>
    </view>
  </view>
</template>
<script>
import { filterPlayCountInfo, filterSetDate } from '@/common/filters'
import { format } from '@/common/date'
import { playlistDetail, heartMode } from '@/api/apis'
export default {
  name: 'SongListLi',
  props: {
    coverImgUrl: {
      type: String
    },
    name: {
      type: String
    },
    trackCount: {
      type: Number
    },
    publishTime: {
      type: Number
    },
    creatorNickname: {
      type: String
    },
    showActionSheet: {
      type: Boolean
    },
    description: {
      type: String
    },
    noCompile: {
      type: Boolean,
      default: false
    },
    // 隐秘歌单
    privacy: {
      type: Number
    },
    myLove: {
      type: Boolean
    },
    home: {
      type: Boolean
    },
    playCount: {
      type: Number
    },
    userInfo: {
      type: Boolean
    },
    bottom: {
      type: Number
    },
    // 歌单id
    songListId: {
      type: Number
    },
    // 歌曲
    songShow: {
      type: Boolean
    },
    songid: {
      type: Number
    },
    number: {
      type: Number
    },
    songplayCount: {
      type: Number
    },
    active: {
      type: Boolean
    },
    artists: {
      type: Array
    },
    albumName: {
      type: String
    },
    // 添加歌曲
    add: {
      type: Boolean
    }
  },
  data () {
    return {
      heartModeList: []
    }
  },
  methods: {
    eventThing () {
      this.$emit('eventThing')
    },
    // 返回一个随机数
    randomNum (min, max) {
      return parseInt(Math.random() * (max - min + 1) + min, 10)
    },
    heartMode () {
      playlistDetail(this.songListId)
        .then(data => {
          const arr = data.playlist.trackIds
          const index = this.randomNum(0, arr.length)
          const item = arr[index]
          this.startHeartMode(item.id, this.songListId)
        })
    },
    // 开启心动模式
    startHeartMode (id, pid) {
      heartMode(id, pid)
        .then(data => {
          this.ruleModeList(data.data, 'songInfo')
          this.$store.dispatch('startPlayAll', { list: this.heartModeList })
        })
    },
    // 对请求到的心动模式数据进行修改，使得可以播放
    ruleModeList (arr, item) {
      arr.forEach(ele => {
        this.heartModeList.push(ele[item])
      })
    },
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    playSong () {
      this.$emit('playSong')
    },
    showAction () {
      this.$emit('showAction', {
        id: this.songListId,
        name: this.name,
        description: this.description,
        noCompile: this.noCompile
      })
    },
    addSong () {
      if (this.$store.state.loginState) {
        this.$emit('addSong', { songid: this.songid, name: this.name })
      } else {
        this.toast('需要登录')
      }
    },
    no () {
      this.toast('该功能尚未实装,敬请期待')
    }
  },
  filters: {
    filterPlayCountInfo,
    filterSetDate,
    format
  }
}
</script>
<style lang='scss' scoped>
$imgWidth: 100rpx;
// 左侧图像
.list-cover {
  position: relative;
  image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $imgWidth;
    height: $imgWidth;
    background: rgba(0, 0, 0, 0.8);
    border-radius: $imgWidth*0.1;
  }
  .song-img {
    width: 80rpx;
    height: 80rpx;
  }
  .icon-icon-system-fn-lock {
    position: absolute;
    right: 26rpx;
    bottom: 23rpx;
    color: #fff;
    width: $imgWidth*0.25;
    height: $imgWidth*0.25;
    font-size: 30rpx;
  }
  .mask {
    position: absolute;
    right: 22.5rpx;
    bottom: $imgWidth*0.1;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 $imgWidth*0.5 $imgWidth*0.5;
    border-color: transparent transparent rgba(0, 0, 0, .6) transparent;
  }
  // 歌曲
  .number {
    font-size: 32rpx;
    color: rgb(124, 123, 123);
  }
  .icon-yinliang {
    color: $defaultColor;
    font-size: 36rpx;
  }
}
.list-num {
  padding-bottom: 1rpx;
  .text {
    margin-left: 4rpx;
  }
}
// 歌曲
.list-info {
  font-size: 23rpx;
  color: #a19d9d;
  .list-title {
    color: black;
    font-size: 28rpx;
  }
  .artist {
    display: inline-block;
    height: $imgWidth*0.4;
    line-height: $imgWidth*0.4;
    font-size: 21rpx;
    &::before {
      content: "/";
      font-size: 20rpx;
      padding: 0 1rpx;
    }
    &:first-of-type::before {
      content: "";
      padding: 0;
    }
  }
  .album-name {
    font-size: 21rpx;
    &::before {
      content: "-";
      padding: 0 1rpx;
    }
  }
}
// 心动按钮
.compile {
  font-size: 24rpx;
  .title-btn {
    width: 175rpx;
    height: $imgWidth*0.5;
    line-height: $imgWidth*0.5;
    padding: 0 $imgWidth*0.1;
    font-size: 24rpx;
    color: black;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, .1);
    .icon-xindong {
      font-size: 24rpx;
      margin-right: 1rpx;
    }
    &:active {
      background-color: rgba(0, 0, 0, .1);
    }
  }
  .icon-sandian {
    color: #a19d9d;
  }
  text {
    color: rgb(141, 138, 138);
    text {
      margin-right: $imgWidth*0.1;
      font-size: 26rpx;
    }
  }
}
.number-show {
  width: $imgWidth;
  text-align: center;
}
.imge {
  width: $height;
  height: $imgWidth;
  text-align: center;
  line-height: $imgWidth;
}
</style>
