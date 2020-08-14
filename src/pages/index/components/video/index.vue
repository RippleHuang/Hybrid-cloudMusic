<template>
  <view class="video-index">
    <!-- 选项卡 -->
		<u-tabs-swiper
			ref="videoTabs"
			:list="listTag"
			active-color="#fff"
			inactive-color="rgba(255, 255, 255, .95)"
			bg-color="#dd001b"
      gutter="80"
      bar-width="50"
			:current="active"
			@change="tabsChange"
		>
		</u-tabs-swiper>
		<swiper class="tabs-swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="tab-swiper-item"  v-for="(data, listTag) in listTag" :key="listTag.id">
				<scroll-view scroll-y class="video-scroll" @scrolltolower="pullDown" v-if="$store.state.loginState">
					<!-- 视频列表 -->
					<loading :height="6.58" :position="'relative'" :style="[{display: loading ? 'flex' : 'none'}]" />
					<view class="video-list-con" :style="[{display: !loading ? 'block' : 'none'}]">
						<video-card
							v-for="(item, ind) in data.data" :key="ind"
							:videoData="item.data"
							:active="active"
							:type="item.type"
              @getVid="getVid"
						/>
					</view>
        </scroll-view>
        <view class="empty" v-else>
          <text class="iconfont icon-kong"></text>
          <text>需要登录</text>
        </view>
			</swiper-item>
		</swiper>
    <loading :height="0.8" :style="[{display: reload ? 'flex' : 'none', bottom: '0px', position: 'fixed'}]"/>
  </view>
</template>
<script>
import VideoCard from '@/components/VideoCard'
import Loading from '@/components/Loading'
import { videoTag, videoGroup } from '@/api/apis'
import { getRandomNumberArray } from '@/common/randomNumberArray'
export default {
  name: 'VideoIndex',
  data () {
    return {
	    swiperCurrent: 0,
      active: 0,
      // 加载相关
      loading: true,
      reload: false,
      finished: false,
      // 数据
      listTag: [],
      videoData: [],
      vid: 0 || ''
    }
  },
  mounted () {
    this.getVideoTag()
  },
  watch: {
    // active 变化清空数据
    active: {
      handler (val, oldV) {
        this.finished = false
        this.videoData = []
        // 首次需要加载
        if (this.listTag[val].data.length === 0) {
          this.loading = true
          this.getVideoGroup(this.listTag[val].id, 0)
        }
      }
    }
  },
  methods: {
		tabsChange(index) {
      this.swiperCurrent = index
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
      let dx = e.detail.dx
			this.$refs.videoTabs.setDx(dx)
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
      let current = e.detail.current
      this.$refs.videoTabs.setFinishCurrent(current)
			this.swiperCurrent = current
			this.active = current
		},
    getVideoTag () {
      videoTag()
        .then(data => {
          // 随机16个tag
          this.listTag = getRandomNumberArray(data.data, 16)
          // 添加新属性data, 新属性sum, showVideo
          for (let index = 0; index < 16; index++) {
            // 两种方法
            this.listTag[index] = Object.assign({}, this.listTag[index], { data: [] })
            this.$set(this.listTag[index], 'sum', 0)
          }
          this.listTag.forEach(item => {
            item.name = item.name.replace(/#/g, '')
          })
          this.getVideoGroup(this.listTag[0].id, 0)
        })
    },
    getVideoGroup (id, offset) {
      videoGroup(id, offset)
        .then(data => {
          this.videoData = data.datas
          this.division()
        })
    },
    // 接口默认8个为一组
    division () {
      // 数据全部加载完成
      if (this.videoData.length === 0) {
        this.finished = true
      }
      this.listTag[this.active].data.push(...this.videoData)
      // 加载状态结束
      this.$nextTick(() => {
        this.loading = false
        this.reload = false
      })
    },
    pullDown () {
      if (this.$store.state.loginState) {
        this.listTag[this.active].sum++
        // 获取对应视频分类的数据
        if (!this.finished) {
          this.reload = true
          this.getVideoGroup(this.listTag[this.active].id, this.listTag[this.active].sum)
        }
      }
    },
    getVid (vid) {
      this.vid = vid
      console.log('this.vid: ', this.vid);
      this.pauseOther()
    },
    // 暂停其他视频
    pauseOther () {
      const arr = []
      const query = uni.createSelectorQuery().in(this)
      query.selectAll('.video-mp4').boundingClientRect(data => {
        arr.push(...JSON.parse(JSON.stringify(data)))
      }).exec()
      const _this = this
      arr.forEach(item => {
        if (item.id) {
          const video = uni.createVideoContext(item.id)
          // 将videos中其他的video全部暂停
          item.id !== _this.vid && video.pause()
        }
      })
    }
  },
  components: {
    VideoCard,
    Loading
  }
}
</script>
<style lang="scss" scoped>
.video-index {
  .video-scroll {
    height: 100vh;
    padding-top: 80rpx;
    /* #ifdef APP-PLUS */
    padding-top: calc(40px + var(--status-bar-height));
    /* #endif */
  }
}
</style>
