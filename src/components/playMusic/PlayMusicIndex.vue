<template>
  <view class="play-music">
    <!-- 全屏播放器 -->
    <view class="full-screen" :style="[{display: fullScreen ? 'block' : 'none'}]">
      <view class="mask" :style="[{background: `url(${imgUrl}?param=300y300) center`}]"></view>
      <page-nav
        :height="'60px'"
        :background="'transparent'"
        defaultShow
        :playName="name"
        :artist="artist"
        share
      />
      <img-cover
        class="img-bgc"
        v-if="imgCoverShow"
        :imgUrl="imgUrl"
        @goLyric="imgCoverShow = !imgCoverShow"
      />
      <!-- 歌词 -->
      <lyric
        :lyricArray="ruleLyric"
        :nowLyricIndex="nowLyricIndex"
        :noLyric="noLyric"
        :noLyricText="noLyricText"
        :marginTop="marginTop"
        v-if="!imgCoverShow"
        @goImg="imgCoverShow = !imgCoverShow"
      />
      <view class="music-bottom">
        <!-- 播放条上一行icon -->
        <PlayMusicIcon :isLike.sync="isLike" :translate.sync="translate" />
        <!-- 播放条 -->
        <view class="slider">
          <text class="start">{{playTime}}</text>
          <u-slider
            v-model="progressWidth"
            active-color="#dd001b"
            :block-width="buttonSize"
            @start="dragStart"
            @end="dragEnd"
            @moving="draging"
            @change="changeTime"
          ></u-slider>
          <text class="end">{{allTime | filterSetTime}}</text>
        </view>
        <!-- 功能icon -->
        <MusicButton
          @play="toggle"
          @prev="prevSong"
          @next="nextSong"
          @changeMode="changeMode"
          :mode="mode"
          @showAudioList="showAudioList"
        />
      </view>
    </view>
    <!-- 迷你播放器 -->
    <small-play
      v-if="!fullScreen"
      :imgUrl="imgUrl"
      @play="toggle"
      @showAudioList="showAudioList"
      :name="name"
      :artist="artist"
      :allTime="allTime"
      :progressWidth="progressWidth"
      :nowLyric="nowLyric"
    />
    <!-- 播放列表 -->
    <u-popup mode="bottom" border-radius="30" v-model="isShowAudioList">
      <view class="audio-list">
        <!-- 头部 -->
        <view class="top">
          <view class="left on-touch" @tap="changeMode">
            <text
            class="iconfont"
            :class="[{
                'icon--lbxh' : mode === 0,
                'icon-loop': mode === 1,
                'icon-suijibofang-wangyiicon': mode === 2
              }]"
            >
            </text>
            <view class="text">
              <text>{{ mode === 0 ? '列表循环' : mode === 1 ? '单曲循环' : '随机播放' }}</text>
              <text>{{`(${playList.length})`}}</text>
            </view>
          </view>
          <view class="right">
            <text class="on-touch"><text class="iconfont icon-chuangjianwenjianjia"></text>收藏全部</text>
            <text class="iconfont icon-trash on-touch" @tap="showModel = true"></text>
          </view>
        </view>
        <!-- 列表 -->
        <scroll-view scroll-y class="list"  @scrolltolower="pullDown">
          <view
            class="list-item on-touch"
            v-for="(item, index) in songList"
            :key="index"
            @tap="audioThis(item, index)"
            :class="[{active: item.id === audioIngSong.id}]"
          >
            <view class="info u-line-1">
              <text class="iconfont icon-yinliang" :style="[{display: item.id === audioIngSong.id ? 'inline-block' : 'none'}]"></text>
              <text class="name">{{item.name}}</text>
              <text
                class="artist"
                :style="[{color: item.id === audioIngSong.id ? '#dd001b' : '#999'}]"
                v-for="(artist, index) in item.artists || item.ar" :key="index"
              >
              {{ artist.name }}
              </text>
            </view>
            <!-- 删除此项歌曲 -->
            <text class="iconfont icon-chahao" @tap.stop="deleteOneSong(item)"></text>
          </view>
          <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
        </scroll-view>
      </view>
      <!-- 下拉加载 -->
      <loading :height="0.8" :style="[{display: reload ? 'flex' : 'none', bottom: '1px', position: 'fixed'}]"/>
    </u-popup>
    <u-modal v-model="showModel" @cancel="showModel = false" show-cancel-button content="确认要清空播放列表？" @confirm="clearAll"></u-modal>
  </view>
</template>
<script>
import PageNav from '@/components/PageNav'
import ImgCover from './ImgCover'
import PlayMusicIcon from './PlayMusicIcon'
import MusicButton from './MusicButton'
import Lyric from './Lyric'
import SmallPlay from './SmallPlay'
import Loading from '@/components/Loading'
import { songUrl, checkSong, songLyric, likeMusicList } from '@/api/apis'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { filterSetTime } from '@/common/filters'
import { shuffle } from '@/common/actionsArray'
export default {
  name: 'PlayMusicIndex',
  data () {
    return {
      // 歌曲相关
      url: '',
      imgUrl: '',
      readySong: false,
      name: '',
      artist: [],
      // 播放条相关
      playTime: '00:00',
      allTime: 0,
      progressWidth: 0,
      drag: false,
      buttonSize: 28,
      // 歌词相关
      originalLyric: '',
      chineseLyric: '',
      nowLyric: '',
      nowLyricIndex: -1,
      ruleLyric: [],
      noLyric: false,
      noLyricText: '',
      offsetLyric: 0,
      translate: false,
      marginTop: '0px',
      // 是否为喜欢音乐
      isLike: false,
      // 瀑布流加载
      sum: 0,
      reload: false,
      finished: false,
      songList: [],
      // 其他
      imgCoverShow: true,
      isShowAudioList: false,
      timer: '',
      showModel: false,
      // 音频api
      audio: ''
    }
  },
  computed: {
    ...mapGetters(['playState',
      'audioList',
      'audioIngIndex',
      'playList',
      'mode',
      'audioIngSong',
      'fullScreen',
      'accountUid',
      'loginState'
    ])
  },
  watch: {
    // 当前歌曲变化，获取歌曲信息
    audioIngSong: {
      immediate: true,
      handler (val, oldVal) {
        if (this.playList.length) {
          // 防止切换模式时重新请求
          if (oldVal != null && val.id === oldVal.id) {
            return
          }
          // 查看当前播放歌曲是否已喜欢
          if (this.loginState) this.getLikeMusicList(val.id)
          // 播放
          if (val.dj) {
            this.checkSong(val.mainTrackId)
          } else {
            this.checkSong(val.id)
          }
          this.allTime = val.duration ? val.duration : val.dt ? val.dt : 0
          this.artist = val.album ? (val.album.artists || val.artists) : val.ar ? val.ar : ''
          this.imgUrl = val.album ? (val.album.picUrl || val.album.artist.img1v1Url) : val.al ? val.al.picUrl
            : val.coverUrl ? val.coverUrl : ''
          this.name = val.name
        } else {
          // 暂停歌曲, 清空时长
          this.audio.seek(0)
          this.toPause()
        }
      }
    },
    audio (val, old) {
      // 销毁上一首歌曲
      if (old) {
        old.destroy()
      }
    },
    // 歌词偏移量
    offsetLyric (val, oldVal) {
      this.offsetLyric = val
    },
    // 歌词翻译
    translate: {
      handler (val, oldVal) {
        // 是否显示中文歌词
        if (val) {
          this.ruleLyric = this.chineseLyric ? this.createLrcArray(this.chineseLyric)
            : this.createLrcArray(this.originalLyric)
          if (!this.chineseLyric) {
            this.toast('暂时没有翻译')
          }
        } else {
          this.ruleLyric = this.createLrcArray(this.originalLyric)
        }
      }
    },
    // 瀑布流加载
    audioList: {
      // 变化时将上一次列表清空
      handler (val, oldV) {
        this.sum = 0
        this.finished = false
        this.songList = []
        // 如果不为空
        if (val.length) this.division(0)
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations([
      'SET_PLAY_SATE',
      'SET_AUDIO_INDEX',
      'SET_AUDIO_MODE',
      'SET_PLAY_LIST'
    ]),
    ...mapActions(['clearPlayAll', 'deleteSong']),
    toast (title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    // 获取音乐url
    getSongUrl (id) {
      songUrl(id)
        .then(data => {
          // 确认可以播放, 但是无版权的url为空,跳过
          if (data.data[0].url != null) {
            this.url = data.data[0].url
            this.audio = uni.createInnerAudioContext()
            this.getSongLyric(id)
            this.starPlay()
          } else {
            // 移出播放列表
            this.deleteSong(this.audioIngSong)
            if (this.playList.length === 0) {
              this.toast('暂无版权')
            } else {
              this.toast('暂无版权,播放下一首')
              this.readySong = true
              this.nextSong()
            }
          }
        })
        .catch(() => {
          this.toast('获取url失败')
        })
    },
    // 获取已喜欢的歌曲列表
    // 得到列表数组后遍历查看当前歌曲是否在已喜欢列表中
    getLikeMusicList (id) {
      likeMusicList(this.accountUid)
        .then(data => {
          this.filterAudio(data.ids, id)
        })
        .catch(() => {
          this.toast('获取已喜欢的列表失败')
        })
    },
    // 判断当前歌曲是否在已喜欢数组中
    filterAudio (arr, id) {
      this.isLike = arr.indexOf(id) > -1
    },
    // 查看歌曲是否可以播放
    checkSong (id) {
      checkSong(id)
        .then(data => {
          // 当可以播放的时候请求歌曲url
          if (data.success) {
            this.getSongUrl(id)
          } else {
            // 移出播放列表
            this.deleteSong(this.audioIngSong)
            if (this.playList.length === 0) {
              this.toast('暂无版权')
            } else {
              this.toast('暂无版权,播放下一首')
              this.readySong = true
              this.nextSong()
            }
          }
        })
        .catch(() => {
          this.toast('暂无版权')
        })
    },
    // 当点击时改变进度条时改变歌曲播放时间,value为回调参数
    changeTime () {
      const currentTime = this.progressWidth * this.audio.duration / 100
      this.audio.seek(currentTime)
    },
    // 播放条拖拽
    dragStart () {
      this.drag = true
      this.buttonSize = 36
    },
    dragEnd () {
      const currentTime = this.progressWidth * this.audio.duration / 100
      this.audio.seek(currentTime)
      this.drag = false
      this.buttonSize = 28
    },
    draging (val) {
      this.drag = true
      if (val >=0 && val <= 100) {
        const current = val * this.audio.duration / 100
        this.setTime(current)
      }
    },
    setTime (current) {
      // 计算到当前的播放时间
      const minutes = Math.floor(current / 60)
      const seconds = Math.floor(current - minutes * 60)
      // 进行格式转换
      const minuteValue = minutes < 10 ? '0' + minutes : minutes
      const secondValue = seconds < 10 ? '0' + seconds : seconds
      this.playTime = minuteValue + ':' + secondValue
    },
    // 播放中
    playing () {
      // 是否拖拽
      if (!this.drag) {
        const audio = this.audio
        // 第一次播放时 duration 为 0, barLength 为 NaN
        const barLength = audio.currentTime / audio.duration * 100
        this.setProgress(isNaN(barLength) ? 0 : barLength)
        this.setTime(audio.currentTime)
        // 设置歌词偏移
        const playTime = audio.currentTime + this.offsetLyric
        const index = this.getCurrentIndex(playTime, this.ruleLyric)
        this.nowLyricIndex = index
        // 设置歌词显示
        this.showLyric(index, this.ruleLyric)
        // 传入当前歌词索引信息
        this.setCurrent(this.nowLyricIndex)
      }
    },
    // 设置进度条长度
    setProgress (val) {
      this.progressWidth = val
    },
    // 获取歌曲歌词
    getSongLyric (id) {
      songLyric(id)
        .then(data => {
          if (data.lrc) {
            this.noLyric = false
            // 翻译歌词原本歌词
            this.chineseLyric = data.tlyric.lyric
            this.originalLyric = data.lrc.lyric
            this.ruleLyric = this.createLrcArray(this.originalLyric)
          } else if (data.nolyric || data.sgc) {
            // 当前歌曲没有歌词
            this.ruleLyric = []
            this.nowLyric = ''
            this.noLyric = true
            this.noLyricText = '纯音乐，请欣赏'
          } else {
            // 没有歌词
            this.noLyricText = '暂时没有歌词'
            this.ruleLyric = []
            this.nowLyric = ''
            this.noLyric = true
          }
        })
        .catch(() => {
          this.toast('获取歌词失败')
        })
    },
    // 创建歌词数组
    createLrcArray (lrc) {
      const parts = lrc.split('\n')
      for (let index = 0; index < parts.length; index++) {
        const element = parts[index]
        parts[index] = this.changeToObject(element)
      }
      return parts
    },
    // 根据一行歌词 转换为对象
    changeToObject (str) {
      const wordsReg = /\[\d{0,}:\d{0,}.\d{0,}\]|\[\d{0,}:\d{0,}:\d{0,}\]/
      const length = str.split(wordsReg).length
      const words = str.split(wordsReg)[length - 1]
      // 返回时间信息
      const reg = /\d{0,}:\d{0,}.\d{0,}/g
      let timeArray = reg.exec(str)
      if (!timeArray) {
        return
      }
      timeArray = timeArray[0].split(':')
      const minute = parseInt(timeArray[0]) // 分钟数
      const second = parseFloat(timeArray[1]) // 秒数
      const time = minute * 60 + second
      return {
        time,
        words
      }
    },
    // 获取当前歌词索引
    getCurrentIndex (time, lyricArray) {
      if (lyricArray.length) {
        for (let i = lyricArray.length - 2; i >= 0; i--) {
          const element = lyricArray[i] != null ? lyricArray[i].time : null
          if (!element) {
            return -1
          }
          if (time > element) {
            return i
          }
        }
      }
      return -1 // 防止没数据时报错
    },
    // 设置当前歌词显示信息
    showLyric (index, array) {
      if (index !== -1) {
        const words = array[index].words
        this.nowLyric = words
      }
    },
    setCurrent (index) {
      // 每次移动是移动一行歌词的高度，一行歌词高度是 40px
      // 120为高亮歌词距离顶部位置
      const top = 120 - index * 40
      // top 不能为正数
      this.marginTop = top > 0 ? '0px' : top + 'px'
    },
    // 单曲循环模式
    loop () {
      this.audio.seek(0)
      this.toPlay()
    },
    // 改变歌曲播放模式
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.SET_AUDIO_MODE(mode)
      let shufflePlayList
      if (mode === 2) {
        shufflePlayList = shuffle(this.audioList)
        this.toast('随机模式')
      } else {
        shufflePlayList = this.audioList
        const message = mode === 1 ? '单曲循环' : '列表循环'
        this.toast(message)
      }
      this.resetCurrentIndex(shufflePlayList)
      this.SET_PLAY_LIST(shufflePlayList)
    },
    // 设置当前播放索引
    resetCurrentIndex (list) {
      const index = list.findIndex(item => {
        return item.id === this.audioIngSong.id
      })
      this.SET_AUDIO_INDEX(index)
    },
    // 上一首歌曲切换
    prevSong () {
      if (!this.readySong) {
        return
      }
      // 只有一首歌时
      if (this.audioList.length === 1) {
        this.loop()
        return
      }
      let nowIndex = this.audioIngIndex - 1
      if (nowIndex === -1) {
        nowIndex = this.audioList.length - 1
      }
      this.SET_AUDIO_INDEX(nowIndex)
      this.readySong = false
    },
    // 下一首歌曲切换
    nextSong () {
      if (!this.readySong) {
        return
      }
      // 只有一首歌时
      if (this.audioList.length === 1) {
        this.loop()
        return
      }
      let nowIndex = this.audioIngIndex + 1
      if (nowIndex === this.audioList.length) {
        nowIndex = 0
      }
      this.SET_AUDIO_INDEX(nowIndex)
      this.readySong = false
    },
    // 播放歌曲
    starPlay () {
      const _this = this
      const audio = this.audio
      audio.autoplay = true
      audio.src = this.url
      this.audio.onTimeUpdate(() => {
        this.playing()
      })
      this.audio.onPlay(() => {
        console.log('开始播放')
        this.readySong = true
      })
      this.audio.onEnded(() => {
        this.end()
      })
    },
    // 暂停歌曲
    toPause () {
      this.audio.pause()
      this.SET_PLAY_SATE(false)
    },
    // 播放
    toPlay () {
      this.audio.play()
      this.SET_PLAY_SATE(true)
    },
    // 播放暂停事件
    toggle () {
      if (this.playState) {
        this.toPause()
      } else {
        this.toPlay()
      }
    },
    // 当歌曲播放完成之后 根据播放模式播放
    end () {
      switch (this.mode) {
        case 0:
          this.nextSong()
          break
        case 1:
          this.loop()
          break
        case 2:
          this.nextSong()
          break
      }
    },
    // 显示歌曲列表
    showAudioList () {
      this.isShowAudioList = !this.isShowAudioList
    },
    // 正在播放项
    audioThis (item, index) {
      // 随机播放情况
      if (this.mode === 2) {
        // 找到对应歌曲的索引
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.SET_AUDIO_INDEX(index)
    },
    // 删除,只有一项时关闭展示列表
    deleteOneSong (song) {
      if (this.playList.length === 1) {
        this.showAudioList()
        this.deleteSong(song)
      } else {
        this.deleteSong(song)
      }
    },
    // 清空播放列表
    clearAll () {
      this.showAudioList()
      this.clearPlayAll()
    },
    // 瀑布流滚动加载,数据太多容易卡顿,30个为一组
    division (sum) {
      const result = []
      for (var i = 0; i < this.audioList.length; i += 30) {
        result.push(this.audioList.slice(i, i + 30))
      }
      if (result[sum] != null) this.songList.push(...result[sum])
      // 加载状态结束
      this.reload = false
      // 数据全部加载完成
      if (result[sum] < 30) {
        this.finished = true
      }
    },
    pullDown () {
      this.sum++
      if (!this.finished) this.division(this.sum)
    }
  },
  filters: {
    filterSetTime
  },
  components: {
    PageNav,
    ImgCover,
    Lyric,
    PlayMusicIcon,
    MusicButton,
    SmallPlay,
    Loading
  }
}
</script>
<style lang='scss' scoped>
// 通过fixed 定位
.play-music {
  width: $width;
  // 全屏播放器
  .full-screen {
    position: relative;
    height: 100vh;
    background: rgba(0, 0, 0, .7);
    // 高斯模糊
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: -1;
      -webkit-filter: blur(15px);
      filter: blur(15px);
    }
    .img-bgc {
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
    }
    // 固定在底部
    .music-bottom {
      position: fixed;
      bottom: 0;
      width: $width;
      .slider {
        display: flex;
        align-items: center;
        padding: 30rpx;
        color: #fff;
        font-size: 24rpx;
        .start {
          padding-right: 20rpx;
        }
        .end {
          padding-left: 20rpx;
        }
      }
    }
  }
  .audio-list {
    position: relative;
    .top {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      width: $width;
      background-color: #fff;
      border-bottom: 1rpx solid #ddd;
      .left {
        display: inline-block;
        height: 100rpx;
        line-height: 100rpx;
        padding-left: 20rpx;
        font-size: 26rpx;
        color: black;
        .iconfont {
          font-size: 30rpx;
        }
        .text {
          display: inline-block;
          margin-left: 10rpx;
          font-size: 30rpx;
        }
      }
      .right {
        height: 100rpx;
        line-height: 100rpx;
        color: black;
        text {
          display: inline-block;
          height: 100rpx;
          padding-right: 20rpx;
        }
        text {
          display: inline-block;
          height: 100rpx;
          padding: 0 20rpx;
          font-size: 28rpx;
        }
      }
    }
    // 配合overflow scroll,在隐藏滚动条
    .list {
      height: 55vh;
      padding-top: 100rpx;
      overflow: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        padding: 0 20rpx;
        .info {
          width: 88vw;
          .icon-yinliang {
            font-size: 35rpx;
            padding-right: 20rpx;
          }
          .name {
            padding-right: 1rpx;
            line-height: 80rpx;
            font-size: 30rpx;
            &::after {
              content: "-";
              margin: 0 0 1rpx 1rpx;
              font-size: 23rpx;
            }
          }
          .artist {
            line-height: 80rpx;
            font-size: 23rpx;
            &::after {
              content: "/";
              font-size: 20rpx;
            }
            &:last-of-type::after {
              content: "";
            }
          }
        }
        .icon-chahao {
          display: inline-block;
          height: 80rpx;
          line-height: 80rpx;
          font-size: 35rpx;
          color: #999;
        }
      }
    }
  }
}
.active {
  color: $defaultColor;
}
</style>
