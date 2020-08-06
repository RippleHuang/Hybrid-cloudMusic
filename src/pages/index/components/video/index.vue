<template>
  <view class="video-index">
    <!-- 选项卡 -->
		<u-tabs-swiper
			ref="videoTabs"
			:list="listTag"
			active-color="#fff"
			inactive-color="rgba(255, 255, 255, .95)"
			bg-color="#dd001b"
      gutter="100"
      bar-width="50"
			:current="current"
			@change="tabsChange"
		>
		</u-tabs-swiper>
		<swiper class="tabs-swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="tab-swiper-item"  v-for="(data, index) in listTag" :key="index">
				<scroll-view class="village-event" @scrolltolower="onLoad" v-if="$store.state.loginState">
					<!-- 视频列表 -->
					<loading :height="6.58" :position="'relative'" :style="[{display: loading ? 'block' : 'none'}]" />
					<view class="video-list-con" :style="[{display: !loading ? 'block' : 'none'}]">
						<video-card
							v-for="(item, index) in data.data" :key="index"
							:data="item.data"
							:active="active"
							:type="item.type"
						/>
					</view>
        </scroll-view>
        <view class="empty" v-else>
          <text class="iconfont icon-kong"></text>
          <text>需要登录</text>
        </view>
			</swiper-item>
		</swiper>
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
			current: 0, // tabs组件的current值
	    swiperCurrent: 0, // swiper组件的current值
      active: 0,
      // 加载相关
      loading: true,
      reload: false,
      finished: false,
      // 数据
      listTag: [],
      data: []
    }
  },
  created () {
    this.getVideoTag()
  },
  watch: {
    // active 变化清空数据
    active: {
      handler () {
        this.finished = false
        this.data = []
        // 首次需要加载
        if (this.listTag[this.active].data.length === 0) {
          this.loading = true
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
			this.current = current
		},
    getVideoTag () {
      videoTag()
        .then(data => {
          // 随机16个tag
          this.listTag = getRandomNumberArray(data.data, 16)
          // 添加新属性data, 新属性sum, showVideo
          for (let index = 0; index < this.listTag.length; index++) {
            // 两种方法
            this.listTag[index] = Object.assign({}, this.listTag[index], { data: [] })
						this.$set(this.listTag[index], 'sum', 0)
					}
					this.listTag.forEach(item => {
						item.name = item.name.replace(/#/g, '')
					})
        })
    },
    getVideoGroup (id, offset) {
      videoGroup(id, offset)
        .then(data => {
          this.data = data.datas
          this.division()
        })
    },
    // 接口默认8个为一组
    division () {
      // 数据全部加载完成
      if (this.data.length === 0) {
        this.finished = true
      }
      this.listTag[this.active].data.push(...this.data)
      // 加载状态结束
      this.$nextTick(() => {
        this.loading = false
        this.reload = false
      })
    },
    onLoad () {
      if (this.$store.state.loginState) {
        this.listTag[this.active].sum++
        // 获取对应视频分类的数据
        this.getVideoGroup(this.listTag[this.active].id, this.listTag[this.active].sum)
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

</style>
