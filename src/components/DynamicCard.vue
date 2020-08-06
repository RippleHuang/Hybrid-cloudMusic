<template>
  <div class="content-box" v-show="loading">
    <div class="dynamic-card van-hairline--bottom" v-for="(item, index) in event" :key="index">
      <!-- 发表动态的用户信息 -->
      <div class="top">
        <div class="img-info" @click="goUserInfo(item.user.userId)">
          <img :src="item.user.avatarUrl + '?param=50y50'" alt />
        </div>
        <div class="author">
          <h1 class="nickname">
            <span class="on-touch" @click="goUserInfo(item.user.userId)">{{item.user.nickname}}</span>
            <span class="category">{{item.type.type}}</span>
          </h1>
          <span class="time">{{item.time | filterSetDate}}</span>
        </div>
      </div>
      <div class="content">
        <h1 class="msg" v-if="item.msg">{{item.msg}}</h1>
        <!-- 用户发的图片,需要循环得到,没有不显示此节点 -->
        <div class="image-box">
          <div
            class="image"
            v-for="(img, index1) in item.pics"
            :key="index1"
            @click="imgPreview(item.pics, index1)"
          >
            <img v-lazy="img.originUrl + '?param=200y200'" :key="img.originUrl" alt="">
          </div>
        </div>
        <!-- 转发样式需修改 -->
        <div class="container-share" :style="{padding: item.msgs ? '.2rem .1rem .1rem': '0'}">
          <p class="share-msg" v-if="item.msgs">
            <span class="share-name">@{{item.event.user.nickname}}</span>
            :{{item.msgs}}
          </p>
          <!-- 视频 -->
          <div class="viedo-img"
            v-if="item.type.type === '分享视频:' ||
                  item.type.type === '发布视频:' ||
                  item.typeNum === 21 ||
                  item.typeNum === 41 ||
                  item.typeNum === 39"
          >
            <video-card
              :data="item.video ? item.video : item.mv
                  ? item.mv : ((item.eventData || {}).video || (item.eventData || {}).mv)"
              :type="(item.video || (item.eventData || {}).video ) ? 1 : 0"
              dynamic
            />
          </div>
          <!-- 其他 -->
          <div class="cover"
            v-else-if="!item.noData"
            :style="{backgroundColor: item.msgs ? 'white': 'rgb(241, 238, 238)'}"
            @click="goOrPlay(item)"
          >
            <img :src="item.img + '?param=50y50'" alt="">
            <!-- 单曲图片图标 -->
            <span class="newsong-icon" v-if="item.song || item.typeNum === 18">
              <i class="iconfont icon-bofang"></i>
            </span>
            <div class="right-info">
              <p class="info-name van-ellipsis">
                <!-- 专栏,电台与歌单tag -->
                <span class="tag" v-if="item.playlist">歌单</span>
                <span class="tag" v-if="item.djRadio">{{item.djRadio.category}}</span>
                <span class="tag" v-if="item.topic">专栏</span>
                {{item.name}}
              </p>
              <p class="byname van-ellipsis"
                v-if="item.playlist || item.djRadio || item.topic"
              >
              by {{item.byNickname}}
              </p>
              <p class="byname van-ellipsis" v-else>
                <span class="tag" v-if="item.channels">{{item.channels}}</span>
                {{item.byNickname}}
              </p>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="icon" @click="noAchieve">
            <i class="iconfont icon-xunhuan1-copy"></i>
            {{item.info.shareCount ? item.info.shareCount : '转发'}}
          </div>
          <div class="icon" @click="noAchieve">
            <i class="iconfont icon-pinglun"></i>
            {{item.info.commentCount ? item.info.commentCount : '评论'}}
          </div>
          <div class="icon" @click="noAchieve">
            <i class="iconfont icon-zanpress"></i>
            {{item.info.likedCount ? item.info.likedCount : '赞'}}
          </div>
          <i class="iconfont icon-sandian on-touch" @click="showShareUser = true"></i>
        </div>
      </div>
    </div>
    <van-share-sheet
      v-model="showShareUser"
      title="分享"
      :options="optionsUser"
      :lock-scroll="false"
    />
  </div>
</template>
<script>
import VideoCard from 'components/VideoCard'
import { songInfo } from 'api/apis'
import { filterSetDate, filterPlayCountInfo, filterSetTime } from 'utils/filters'
import types from '@/getShareInfo/shareInfo'
import shareTypes from '@/getShareInfo/shareEvent'
import { ImagePreview } from 'vant'
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
      event: [],
      showShareUser: false,
      optionsUser: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' },
          { name: '复制链接', icon: 'link' },
          { name: '二维码', icon: 'qrcode' }
        ],
        [
          { name: '分享', icon: 'poster' }
        ]
      ]
    }
  },
  // 监听传来的数据变化,处理数据
  watch: {
    dataMsg: {
      deep: true,
      handler (val, oldV) {
        this.event = this.getData(val)
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
        this.$router.push('/showsong?albumId=' + playListId)
      } else if (_data.album) {
        const albumId = _data.album.id
        this.$router.push('/showsong?dishId=' + albumId)
      } else if (_data.song) {
        const songId = _data.song.id
        this.getSongInfo(songId)
      } else {
        this.$toast('暂不支持')
      }
    },
    // 播放
    getSongInfo (ids) {
      songInfo(ids)
        .then(data => {
          this.$store.dispatch('addToAudioList', data.songs[0])
        })
        .catch(() => {
          this.$toast('获取歌曲失败')
        })
    },
    // 预览图片
    imgPreview (data, index) {
      const imageArr = []
      for (let i = 0; i <= data.length - 1; i++) {
        imageArr[i] = data[i].originUrl
      }
      ImagePreview({ images: imageArr, closeable: true, startPosition: index })
    },
    noAchieve () {
      this.$toast('此功能尚未开通, 敬请期待')
    },
    // 动态消息页去个人信息页
    goUserInfo (id) {
      if (this.$store.state.accountUid === id) {
        this.$toast('这是自己的动态')
      } else {
        this.$router.push('/userInfo?accountUid=' + id)
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
.dynamic-card {
  padding: .4rem .3rem 0;
  // 头部
  .top {
    display: flex;
    height: .75rem;
    // 头像
    .img-info {
      width: .75rem;
      margin-right: .2rem;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    .author {
      flex: 1;
      line-height: 1.5;
      .nickname {
        font-size: .28rem;
        color: #4ca1e6;
        .on-touch {
          margin-right: .15rem;
        }
        .category {
          color: #7b7c7d;
        }
      }
      .time {
        font-size: .22rem;
        color: #7b7c7d;
      }
      .img-content {
        width: 5.4rem;
        height: 0;
        padding-bottom: 2rem;
        img {
          width: 100%;
          border-radius: 0.2rem;
        }
      }
    }
  }
  // 内容区
  .content {
    padding: .2rem .2rem 0 .95rem;
    // 用户发言
    .msg {
      padding-bottom: .1rem;
      color: black;
      font-size: .3rem;
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
        padding-bottom: .1rem;
        // 瀑布流
        // break-inside: avoid;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: .1rem;
        }
      }
    }
    // 分享内容
    .container-share {
      background-color: rgb(241, 238, 238);
      border-radius: .1rem;
      &:active {
        background-color: rgb(1, 1, 1, .1);
      }
      // 转发作者发言
      .share-msg {
        margin-bottom: .2rem;
        font-size: .26rem;
        line-height: 1.4;
        color: rgb(78, 76, 76);
        word-break: break-all;
        .share-name {
          font-size: .26rem;
          color: #55a1df;
        }
      }
      // 视频卡片
      .viedo-img {
        position: relative;
        width: 100%;
        padding: 0;
        img {
          width: 100%;
          height: auto;
          border-radius: .1rem;
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
          font-size: .8rem;
          transform: translate(-50%, -50%);
        }
        .duration {
          position: absolute;
          right: .1rem;
          bottom: .1rem;
          color: #fff;
          font-size: .24rem;
          i {
            padding-right: .05rem;
            font-size: .2rem;
          }
        }
        .playtime {
          @extend .duration;
          left: .1rem;
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
        height: .8rem;
        padding: .1rem;
        border-radius: .1rem;
        img {
          width: .8rem;
          height: .8rem;
          margin-right: .2rem;
          border-radius: .1rem;
        }
        // 歌单icon
        .newsong-icon {
          position: absolute;
          left: .35rem;
          top: .35rem;
          z-index: 3;
          width: .3rem;
          height: .3rem;
          border-radius: 50%;
          background-color: rgb(255, 255, 255, .8);
          overflow: hidden;
          .icon-bofang {
            position: absolute;
            left: 50%;
            top: 50%;
            color: #dd001b;
            font-size: .16rem;
            transform: translate(-50%, -50%);
          }
        }
        // 右边内容
        .right-info {
          width: 78%;
          .tag {
            display: inline-block;
            margin-right: .08rem;
            padding: .03rem .08rem .01rem;
            color: #dd001b;
            font-size: .17rem;
            border: .01rem solid #dd001b;
            border-radius: .05rem;
          }
          .info-name {
            width: 100%;
            padding-top: .04rem;
            color: black;
            font-size: .26rem;
          }
          .byname {
            width: 100%;
            padding-top: .15rem;
            color: rgb(102, 100, 100);
            font-size: .2rem;
          }
        }
      }
    }
    // 底部内容
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.1rem;
      .icon {
        display: flex;
        flex: 1;
        height: .5rem;
        line-height: .5rem;
        font-size: .26rem;
        color: #7b7c7d;
        i {
          display: flex;
          margin-right: .06rem;
          font-size: .38rem;
          color: rgb(68, 67, 67);
          &:active {
            color: #7b7c7d;
          }
        }
      }
      .icon-sandian {
        flex: .4;
        height: 1.1rem;
        line-height: 1.1rem;
        text-align: right;
        font-size: .34rem;
        color: #7b7c7d;
      }
    }
  }
}
</style>
