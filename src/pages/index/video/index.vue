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
				<scroll-view scroll-y class="video-scroll" @scrolltolower="pullDown" v-if="loginState">
					<!-- 视频列表 -->
					<loading :height="6.58" :position="'relative'" :style="[{display: loading ? 'flex' : 'none'}]" />
					<view class="video-list-con" :style="[{display: !loading ? 'block' : 'none'}]">
						<video-card
							v-for="(item, ind) in data.data" :key="ind"
							:videoData="item.data"
							:vidList="vidList"
							:active="active"
							:type="item.type"
						/>
					</view>
        </scroll-view>
        <scroll-view v-else>
          <view class="empty">
            <text class="iconfont icon-kong"></text>
            <text>需要登录</text>
          </view>
        </scroll-view>
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
import { mapGetters } from 'vuex'
export default {
  name: 'VideoIndex',
  props: {
    activeIndex: {
      type: Number
    }
  },
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
			vidList: []
    }
  },
	computed: {
		...mapGetters(['loginState'])
	},
  watch: {
    // active 变化清空数据
    active: {
      handler (val, oldV) {
        this.finished = false
        this.videoData = []
				this.vidList = []
        // 首次需要加载
        if (this.listTag[val].data.length === 0) {
          this.loading = true
          this.getVideoGroup(this.listTag[val].id, 0)
        }
      }
    },
    activeIndex (val, oldV) {
      if (val === 3 && this.listTag.length === 0) {
        this.getVideoTag()
      }
    },
    loginState: {
      handler (val, oldV) {
        if (val && this.listTag.length === 0) {
          this.getVideoTag()
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
					data.datas.forEach(item => {
						this.vidList.push(item.data.vid)
					})
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
.empty {
  margin-top: 300rpx;
}
</style>
