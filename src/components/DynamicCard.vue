<template>
  <scroll-view scroll-y class="content-box" :style="[{display: loading ? 'block' : 'none'}]">
    <view class="dynamic-card" v-for="(item, index) in event" :key="index">
      <!-- 发表动态的用户信息 -->
      <view class="top">
        <view class="img-info" @tap="goUserInfo(item.user.userId)">
          <image :src="item.user.avatarUrl + '?param=50y50'" alt />
        </view>
        <view class="author">
          <view class="nickname">
            <text class="on-touch" @tap="goUserInfo(item.user.userId)">{{item.user.nickname}}</text>
            <text class="category">{{item.type.type}}</text>
          </view>
          <text class="time">{{item.time | filterSetDate}}</text>
        </view>
      </view>
      <view class="content">
        <text class="msg" v-if="item.msg">{{item.msg}}</text>
        <!-- 用户发的图片,需要循环得到,没有不显示此节点 -->
        <view class="image-box">
          <view
            class="image"
            v-for="(img, index1) in item.pics"
            :key="index1"
            :style="[{width: item.pics.length >= 3 ? '32%' : '48%'}]"
            @tap="imgPreview(item.pics, index1)"
          >
            <image :mode="item.pics.length >= 3 ? 'scaleToFill' : 'widthFix'" :style="[{height: item.pics.length >= 3 ? 'calc((100vw - 80px)*0.32)': ''}]" :src="img.originUrl + '?param=200y200'" :key="img.originUrl" alt="">
          </view>
        </view>
        <!-- 转发样式需修改 -->
        <view class="container-share" :style="[{padding: item.msgs ? '10px 5px 5px': '0'}]">
          <view class="share-msg" v-if="item.msgs">
            <text class="share-name">@{{item.event.user.nickname}}</text>
            :{{item.msgs}}
          </view>
          <!-- 视频 -->
          <view class="viedo-img"
            v-if="item.type.type === '分享视频:' ||
                  item.type.type === '发布视频:' ||
                  item.typeNum === 21 ||
                  item.typeNum === 41 ||
                  item.typeNum === 39"
          >
            <video-card
              :videoData="item.video ? item.video : item.mv
                  ? item.mv : ((item.eventData != null ? (item.eventData.video || item.eventData.mv) : ''))"
              :type="(item.video || (item.eventData != null ? item.eventData.video : 0) ) ? 1 : 0"
              dynamic
            />
          </view>
          <!-- 其他 -->
          <view class="cover"
            v-else-if="!item.noData"
            :style="[{backgroundColor: item.msgs ? 'white': 'rgb(241, 238, 238)'}]"
            @tap="goOrPlay(item)"
          >
            <image :src="item.img + '?param=50y50'" alt="">
            <!-- 单曲图片图标 -->
            <text class="newsong-icon" v-if="item.song || item.typeNum === 18">
              <text class="iconfont icon-bofang"></text>
            </text>
            <view class="right-info">
              <view class="info-name u-line-1">
                <!-- 专栏,电台与歌单tag -->
                <text class="tag" v-if="item.playlist">歌单</text>
                <text class="tag" v-if="item.djRadio">{{item.djRadio.category}}</text>
                <text class="tag" v-if="item.topic">专栏</text>
                {{item.name}}
              </view>
              <text class="byname u-line-1"
                v-if="item.playlist || item.djRadio || item.topic"
              >
              by {{item.byNickname}}
              </text>
              <view class="byname u-line-1" v-else>
                <text class="tag" v-if="item.channels">{{item.channels}}</text>
                {{item.byNickname}}
              </view>
            </view>
          </view>
        </view>
        <view class="actions">
          <view class="icon" @tap="noAchieve">
            <text class="iconfont icon-xunhuan1-copy"></text>
            {{item.info.shareCount ? item.info.shareCount : '转发'}}
          </view>
          <view class="icon" @tap="noAchieve">
            <text class="iconfont icon-pinglun"></text>
            {{item.info.commentCount ? item.info.commentCount : '评论'}}
          </view>
          <view class="icon" @tap="noAchieve">
            <text class="iconfont icon-zanpress"></text>
            {{item.info.likedCount ? item.info.likedCount : '赞'}}
          </view>
          <text class="iconfont icon-sandian on-touch" @tap="noAchieve"></text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>
<script>
import VideoCard from '@/components/VideoCard'
import { songInfo } from '@/api/apis'
import { filterSetDate, filterPlayCountInfo, filterSetTime } from '@/common/filters'
import types from '@/common/shareInfo'
import shareTypes from '@/common/shareEvent'
export default {
  name: 'DynamicCard',
  props: {
    loading: {
      type: Boolean
    },
    dataMsg: {
      type: Array
    }
  },
  data () {
    return {
      event: []
    }
  },
  // 监听传来的数据变化,处理数据
  watch: {
    dataMsg: {
      deep: true,
      handler (value, oldV) {
        if (value.length) this.event = this.getData(value)
      },
      immediate: true
    }
  },
  methods: {
    // 处理数据
    getData (arr) {
      const res = []
      arr.forEach((val, index) => {
        res.push(JSON.parse(val.json))
        const json = JSON.parse(val.json)
        // 类型,原本数据为数字,为了规范加字母开头
        const typeDate = 'a' + val.type
        // 转发评论点赞信息
        const info = val.info
        // 用户信息
        const user = val.user
        // msg图片
        const pics = val.pics
        // 时间
        const time = val.showTime
        // 这里通过 [] 来读取对象value
        res[index].type = types[typeDate]
        // 分享内容信息
        // 请求数据类型
        const data = res[index].type.data
        res[index].info = info
        res[index].user = user
        res[index].pics = pics
        res[index].time = time
        // 是不是转发
        if (data === 'event' && json.event !== null) {
          // 转发数据
          const dataJson = res[index].type.dataJson
          const eventData = JSON.parse(json[data][dataJson])
          res[index].eventData = eventData
          // 遍历key
          const length = Object.keys(eventData).length
          const eventType = shareTypes[Object.keys(eventData)[length - 1]]
          // 没数据跳过
          if (!eventType) {
            res[index].noData = true
            return
          }
          const mold = eventType.data
          const img = eventType.img
          const name = eventType.name
          const creator = eventType.creatorName[0]
          const nickname = eventType.creatorName[1]
          res[index].msgs = eventData.msg
          res[index].typeNum = json.event.type
          res[index].img = mold === 'song' ? eventData.song.album.blurPicUrl : eventData[mold][img]
          res[index].name = mold !== 'song'
            ? eventData[mold][name] : eventData.song.alias.length === 0
              ? eventData[mold][name] : eventData[mold][name] + `(${eventData.song.alias[0]})`
          // 视频
          if (eventData.video) {
            // 播放次数,时间
            res[index].playTime = eventData.video.playTime
            res[index].duration = eventData.video.duration
          }
          // 电台tag
          if (eventData.channels) {
            res[index].channels = eventData.program.channels[0]
          }
          // 转发电台判断
          if (creator === nickname) {
            res[index].byNickname = eventData[mold][creator]
          }
          if (creator !== nickname) {
            res[index].byNickname = mold === 'song' ? eventData.song.artists[0].name : eventData[mold][creator][nickname]
          }
        } else if (data === 'no') { // a33 数据
          res[index].img = json.coverPCUrl
          res[index].name = json.title
          res[index].msg = json.text.join('')
        } else { // 其他数据
          // 是否有数据
          if (data in json && json.data !== null && json.event !== null) {
            // 对应类型和数据
            const mold = res[index].type
            const jsonData = json[data]
            const img = mold.img
            const name = mold.name
            const creator = mold.creatorName[0]
            const nickname = mold.creatorName[1]
            const byName = data === 'song' ? jsonData.artists[0].name : jsonData[creator][nickname]
            res[index].img = data === 'song' ? jsonData.album.picUrl
              : val.type === 31 ? 'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg' : jsonData[img]
            res[index].name = data !== 'song'
              ? jsonData[name] : jsonData.alias.length === 0
                ? jsonData[name] : jsonData[name] + `(${jsonData.alias[0]})`
            res[index].byNickname = creator !== nickname ? byName : jsonData.dj ? jsonData.dj.nickname : jsonData[creator]
            // 播放id
            if (jsonData.id) res[index].id = jsonData.id
            // 视频
            if (json.video) {
              // 播放次数,时间
              res[index].playTime = json.video.playTime
              res[index].duration = json.video.duration
            }
          } else {
            res[index].noData = true
          }
        }
      })
      return res
    },
    // 播放或去歌单页
    goOrPlay (data) {
      const _data = data.event ? data.eventData : data
      if (_data.playlist) {
        const playListId = _data.playlist.id
        uni.navigateTo({
          url: `/otherPages/showsong/showSongList?albumId=${playListId}`,
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else if (_data.album) {
        const albumId = _data.album.id
        uni.navigateTo({
          url: `/otherPages/showsong/showSongList?dishId=${albumId}`,
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else if (_data.song) {
        const songId = _data.song.id + ''
        this.getSongInfo(songId)
      } else {
        this.toast('暂不支持')
      }
    },
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    // 播放
    getSongInfo (ids) {
      songInfo(ids)
        .then(data => {
          this.$store.dispatch('addToAudioList', data.songs[0])
          this.toast('开始播放')
        })
    },
    // 预览图片
    imgPreview (data, index) {
      const imageArr = []
      for (let text = 0; text <= data.length - 1; text++) {
        imageArr[text] = data[text].originUrl
      }
      uni.previewImage({
        urls: imageArr,
        current: index
      })
    },
    noAchieve () {
      this.toast('此功能尚未开通, 敬请期待')
    },
    // 动态消息页去个人信息页
    goUserInfo (id) {
      if (this.$store.state.accountUid === id) {
        this.toast('这是自己的动态')
      } else {
        uni.navigateTo({
          url: '/otherPages/userInfo/userInfo?accountUid=' + id,
          animationType: 'pop-in',
          animationDuration: 200
        })
      }
    }
  },
  filters: {
    filterSetDate,
    filterPlayCountInfo,
    filterSetTime
  },
  components: {
    VideoCard
  }
}
</script>
<style lang='scss' scoped>
.content-box {
  height: 100vh;
}
.dynamic-card {
  padding: 40rpx 30rpx 0;
  border-bottom: 1rpx solid #eee;
  // 头部
  .top {
    display: flex;
    height: 75rpx;
    // 头像
    .img-info {
      width: 75rpx;
      margin-right: 20rpx;
      image {
        width: 100%;
        height: 75rpx;
        border-radius: 50%;
      }
    }
    .author {
      flex: 1;
      line-height: 1.5;
      .nickname {
        font-size: 28rpx;
        color: #4ca1e6;
        .on-touch {
          margin-right: 15rpx;
        }
        .category {
          color: #7b7c7d;
        }
      }
      .time {
        font-size: 22rpx;
        color: #7b7c7d;
      }
      .img-content {
        width: 540rpx;
        height: 0;
        padding-bottom: 200rpx;
        image {
          width: 100%;
          border-radius: 20rpx;
        }
      }
    }
  }
  // 内容区
  .content {
    padding: 20rpx 20rpx 0 95rpx;
    // 用户发言
    .msg {
      display: block;
      padding-bottom: 10rpx;
      color: black;
      font-size: 30rpx;
      line-height: 1.4;
      word-break: break-all;
    }
    // 用户发的图片
    .image-box {
      // 瀑布流
      // width: 96.5%;
      // column-count: 3; 不兼容
      // flex 方法
      display: flex;
      flex-flow: wrap;
      justify-content: space-between;
      width: 100%;
      .image {
        // flex 方法
        display: flex;
        flex-direction: row;
        width: 32%;
        padding-bottom: 10rpx;
        // 瀑布流
        // break-inside: avoid;

        image {
          display: block;
          width: 100%;
          border-radius: 10rpx;
        }
      }
    }
    // 分享内容
    .container-share {
      background-color: rgb(241, 238, 238);
      border-radius: 10rpx;
      &:active {
        background-color: rgb(1, 1, 1, .1);
      }
      // 转发作者发言
      .share-msg {
        margin-bottom: 20rpx;
        font-size: 26rpx;
        line-height: 1.4;
        color: rgb(78, 76, 76);
        word-break: break-all;
        .share-name {
          font-size: 26rpx;
          color: #55a1df;
        }
      }
      // 视频卡片
      .viedo-img {
        position: relative;
        width: 100%;
        padding: 0;
        image {
          width: 100%;
          height: auto;
          border-radius: 10rpx;
        }
        // 蒙版
        .mask {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(136, 134, 134, 0.5);
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
        .duration {
          position: absolute;
          right: 10rpx;
          bottom: 10rpx;
          color: #fff;
          font-size: 24rpx;
          text {
            padding-right: 2rpx;
            font-size: 20rpx;
          }
        }
        .playtime {
          @extend .duration;
          left: 10rpx;
          .icon-gedanbofangliang_ {
            padding-right: 0;
          }
        }
      }
      // 分享条
      .cover {
        position: relative;
        display: flex;
        align-items: center;
        height: 100rpx;
        padding: 10rpx;
        border-radius: 10rpx;
        image {
          width: 80rpx;
          height: 80rpx;
          margin-right: 20rpx;
          border-radius: 10rpx;
        }
        // 歌单icon
        .newsong-icon {
          position: absolute;
          left: 35rpx;
          top: 35rpx;
          z-index: 3;
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          background-color: rgb(255, 255, 255, .8);
          overflow: hidden;
          .icon-bofang {
            position: absolute;
            left: 50%;
            top: 50%;
            color: $defaultColor;
            font-size: 16rpx;
            transform: translate(-50%, -50%);
          }
        }
        // 右边内容
        .right-info {
          width: 78%;
          .tag {
            display: inline-block;
            margin-right: 8rpx;
            padding: 1rpx;
            color: $defaultColor;
            font-size: 17rpx;
            border: .01rpx solid $defaultColor;
            border-radius: .05rpx;
          }
          .info-name {
            display: block;
            width: 100%;
            padding-top: 4rpx;
            color: black;
            font-size: 26rpx;
          }
          .byname {
            display: block;
            width: 100%;
            padding-top: 15rpx;
            color: rgb(102, 100, 100);
            font-size: 20rpx;
          }
        }
      }
    }
    // 底部内容
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 110rpx;
      .icon {
        display: flex;
        flex: 1;
        height: 50rpx;
        line-height: 50rpx;
        font-size: 26rpx;
        color: #7b7c7d;
        text {
          display: flex;
          margin-right: 1rpx;
          font-size: 38rpx;
          color: rgb(68, 67, 67);
          &:active {
            color: #7b7c7d;
          }
        }
      }
      .icon-sandian {
        flex: .4;
        height: 110rpx;
        line-height: 110rpx;
        text-align: right;
        font-size: 34rpx;
        color: #7b7c7d;
      }
    }
  }
}
</style>
