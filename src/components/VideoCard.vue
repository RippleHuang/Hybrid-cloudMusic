<template>
  <view class="video-item" :class="[{'video-style': !dynamic}]">
    <!-- 视频预览图片,播放时隐藏 -->
    <view
      class="viedo-img"
      :style="[{
        display: videoCanPlay ? 'none': 'block',
        height: dynamic ? (landscape ? 'auto' : '155px') : '185px',
        'border-radius': landscape ? '0' : '10px'
        }]"
    >
      <!-- video或mv -->
      <image
        mode="aspectFill"
        :src="(videoData.coverUrl ? videoData.coverUrl : videoData.imgurl ? videoData.imgurl : videoData.cover) + (landscape ? '' : '?param=350y200')"
        :style="[{'border-radius': landscape ? '0' : '10px'}]"
      ></image>
      <view class="mask" :style="[{bottom: landscape ? '3px': '0'}]"></view>
      <text class="tag" v-if="!dynamic">{{ videoData.videoGroup[0] != null ? videoData.videoGroup[0].name : ''}}</text>
      <view class="playtime">
        <text class="iconfont icon-gedanbofangliang_"></text>
        {{videoData.playTime || videoData.playCount | filterPlayCount}}
      </view>
      <view class="duration">
        <text class="iconfont icon-paihangbang"></text>
        {{videoData.durationms || videoData.duration | filterSetTime}}
      </view>
      <text class="iconfont icon-bofang" @tap="clickTostar"></text>
    </view>
    <!-- 视频播放 -->
    <view
      class="play-video"
      :style="[{
        display: videoCanPlay ? 'block': 'none',
        'border-radius': !dynamic ? '10px' : landscape ? '0' : '5px'
      }]"
    >
      <!-- #ifdef APP-PLUS -->
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <!-- #endif -->
      <view class="top u-line-1" :style="[{display: landscape ? 'block' : 'none'}]">
        <text class="iconfont icon-zuo" @tap="goback"></text>
        <text class="title">{{videoData.title || videoData.name}}</text>
      </view>
      <video
        :src="mp4Url"
        :autoplay="canplay"
        class="video-mp4"
        :id="vid + ''"
      >
      </video>
    </view>
    <!-- 底部信息,动态页隐藏 -->
    <view class="video-bottom" v-if="!dynamic">
      <!-- video或mv -->
      <text class="title u-line-2">{{videoData.title || videoData.name}}</text>
      <view class="content-box">
        <view class="info" @tap="goUserInfo(videoData.creator)">
          <image :src="(videoData.creator ? videoData.creator.avatarUrl : (videoData.artists[0] != null ? videoData.artists[0].img1v1Url : ''))+ '?param=50y50'" alt />
          <text class="name u-line-1">{{videoData.creator ? videoData.creator.nickname : (videoData.artists[0] != null ? videoData.artists[0].name : '')}}</text>
        </view>
        <view class="right">
          <view class="icon" @tap="noAchieve">
            <text class="iconfont icon-zanpress"></text>
            <text class="num">{{videoData.praisedCount || videoData.likeCount | filterPlayCount}}</text>
          </view>
          <view class="icon" @tap="noAchieve">
            <text class="iconfont icon-pinglun"></text>
            <text class="num">{{videoData.commentCount || videoData.commentCount | filterPlayCount}}</text>
          </view>
          <text class="iconfont icon-sandian" @tap="noAchieve"></text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { filterPlayCount, filterSetTime } from '@/common/filters'
import { videoUrl, mvUrl } from '@/api/apis'
export default {
  name: 'VideoCard',
  props: {
    videoData: {
      type: [Object, Array]
    },
    active: {
      type: Number
    },
    type: {
      type: Number
    },
    // 动态和全屏播放传过来的
    dynamic: {
      type: Boolean
    },
    landscape: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mp4Url: '',
      // 是否显示视频
      videoCanPlay: false,
      vid: 0 || '',
      canplay: false
    }
  },
  watch: {
    active: {
      handler (val, oldV) {
        // 暂停视频与隐藏
        if (this.vid) {
          this.videoPause()
          this.videoCanPlay = false
        }
      }
    },
    // 监听歌曲播放状态
    '$store.state.playState' (val, oldV) {
      // 播放歌曲时暂停隐藏视频
      if (val) {
        this.videoPause()
        this.videoCanPlay = false
      }
    },
    // 暂停上一个视频
    vid: {
      handler (val, oldV) {
        this.$nextTick(() => {
          this.$emit('getVid', val)
        })
      }
    }
  },
  methods: {
    // 是否要获取
    clickTostar () {
      // 是否有vid
      if (!this.vid) {
        this.getUrl()
      } else { // 已经加载完的不用再请求,直接播放
        this.videoPlay()
      }
    },
    // 获取url
    async getUrl () {
      this.vid = await this.videoData.videoId ? this.videoData.videoId : this.videoData.vid ? this.videoData.vid : this.videoData.id
      // type 1为video, 0为mv
      if (this.type === 1) {
        videoUrl(this.vid)
          .then(data => {
            // 得到url
            this.mp4Url = data.urls[0].url
            this.startPlay()
          })
      } else if (this.type === 0) { // mv
        // 获取mv
        mvUrl(this.vid)
          .then(data => {
            // 得到url
            this.mp4Url = data.data.url
            this.startPlay()
          })
      }
    },
    // 准备就绪
    startPlay () {
      this.videoCanPlay = true
      // 播放前清空歌曲播放列表,暂停其他的视频
      this.$store.dispatch('clearPlayAll')
      // 播放
      this.videoPlay()
    },
    // 播放视频
    videoPlay () {
      // #ifdef APP-PLUS
      if (!this.landscape) {
        this.videoCanPlay = false
        const { vid, type } = this
        uni.navigateTo({
          url: `/otherPages/landscape/Landscape?vid=${vid}&type=${type}`,
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else {
        this.canplay = true
      }
      // #endif
      // #ifndef APP-PLUS
      this.canplay = true
      // #endif
    },
    // 暂停视频
    videoPause () {
      const vid = this.vid + ''
      const video = uni.createVideoContext(vid)
      video.pause()
    },
    goUserInfo (videoData) {
      if (videoData) {
        uni.navigateTo({
          url: '/otherPages/userInfo/userInfo?accountUid=' + videoData.userId,
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else {
        uni.showToast({title:'暂不支持歌手信息页', icon: 'none'})
      }
    },
    goback () {
      uni.navigateBack({
        delta: 1,
        animationType: 'pop-out',
        animationDuration: 200
      })
    },
    noAchieve () {
      uni.showToast({title:'此功能尚未开通, 敬请期待', icon: 'none'})
    }
  },
  filters: {
    filterPlayCount,
    filterSetTime
  }
}
</script>
<style lang='scss' scoped>
.video-item {
  // 视频卡片
  .viedo-img {
    position: relative;
    width: 100%;
    padding: 0;
    border-radius: 20rpx;
    overflow: hidden;
    image {
      width: 100%;
      border-radius: 10rpx;
    }
    // 蒙版
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background-color: rgba(136, 134, 134, 0.5);
    }
    // 视频标签
    .tag {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      display: block;
      padding: 10rpx 15rpx;
      color: #fff;
      border-radius: 30rpx;
      border: 1rpx solid rgba(255, 255, 255, .15);
      font-size: 22rpx;
      background-color: rgba(255, 255, 255, 0.1);
    }
    // 中间播放icon
    .icon-bofang {
      position: absolute;
      top: 50%;
      left: 50%;
      color: rgba(255, 255, 255, .7);
      font-size: 80rpx;
      transform: translate(-50%, -50%);
    }
    // 右边时间
    .duration {
      position: absolute;
      right: 15rpx;
      bottom: 15rpx;
      color: #fff;
      font-size: 24rpx;
      .iconfont {
        padding-right: 4rpx;
        font-size: 20rpx;
      }
    }
    // 左边播放量
    .playtime {
      @extend .duration;
      left: 15rpx;
    }
  }
  // 视频
  .play-video {
    position: relative;
    height: auto;
    padding-top: 60rpx;
    background-color: black;
    overflow: hidden;
    .status_bar {
      height: var(--status-bar-height);
      width: 100%;
    }
    .top {
      position: absolute;
      top: 0;
      /* #ifdef APP-PLUS */
      top: var(--status-bar-height);
      /* #endif */
      left: 0;
      z-index: 10;
      height: 60rpx;
      width: 100%;
      line-height: 60rpx;
      background-color: black;
      color: #fff;
      .icon-zuo {
        padding: 20rpx;
        font-size: 30rpx;
      }
      .title {
        font-size: 30rpx;
      }
    }
    .video-mp4 {
      width: 100%;
    }
  }
  // 底部条
  .video-bottom {
    .title {
      padding: 30rpx 0;
      line-height: 1.3;
    }
    .content-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 90rpx;
      padding: 20rpx 0;
      border-top: 1rpx solid #ddd;
      .info {
        display: flex;
        align-items: center;
        color: black;
        image {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
        }
        .name {
          margin-left: 20rpx;
          font-size: 28rpx;
        }
      }
      .right {
        display: flex;
        height: 90rpx;
        line-height: 90rpx;
        color: rgb(131, 126, 126);
        .icon {
          margin-right: 50rpx;
          &:active {
            color: rgb(212, 206, 206);
          }
          .iconfont {
            margin-right: 10rpx;
            font-size: 28rpx;
          }
        }
        .icon-sandian {
          color: black;
        }
      }
    }
  }
}
.video-style {
  padding: 20rpx 30rpx 0;
  border-bottom: 20rpx solid #ccc;
}
</style>
