<template>
  <scroll-view scroll-y class="village">
    <!-- 选项卡 -->
		<u-tabs-swiper
			ref="villageTabs"
			:list="list"
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
			<swiper-item class="tab-swiper-item">
				<loading :height="6.58" :position="'relative'" :style="[{display: !load ? 'flex' : 'none'}]" />
        <view class="card-box" :style="[{display: load ? 'flex' : 'none'}]">
          <village-card
            v-for="(item, index) in hotwall" :key="index"
            :content="item.content"
            :likedCount="item.likedCount"
            :nickname="item.simpleUserInfo.nickname"
            :avatar="item.simpleUserInfo.avatar"
            :imgUrl="item.simpleResourceInfo.songCoverUrl"
            :userId="item.simpleUserInfo.userId"
          />
        </view>
			</swiper-item>
			<swiper-item class="tab-swiper-item">
				<view class="village-event" v-if="$store.state.loginState">
          <loading :height="6.58" :style="[{display: !loading ? 'flex' : 'none'}]" />
					<dynamic-card
						:dataMsg="eventAll"
						:loading="loading"
					/>
          <!-- 加载更多 -->
          <view class="more on-touch" @tap="pullDown">
            <text :style="[{display: !reload ? 'flex' : 'none'}]">展开更多动态</text>
            <loading :height="0.8" :style="[{display: reload ? 'flex' : 'none'}]"/>
          </view>
          <text class="finished" :style="[{display: finished ? 'flex' : 'none'}]">没有更多了</text>
        </view>
        <view class="empty" v-else>
          <text class="iconfont icon-kong"></text>
          <text>需要登录</text>
        </view>
			</swiper-item>
		</swiper>
  </scroll-view>
</template>
<script>
import VillageCard from './VillageCard'
import Loading from '@/components/Loading'
import DynamicCard from '@/components/DynamicCard'
import { hotwallVillage, eventVillage } from '@/api/apis'
export default {
  name: 'VillageIndex',
  data () {
    return {
			list: [{
				name: '广场'
			}, {
				name: '动态'
			}],
			current: 0, // tabs组件的current值
	    swiperCurrent: 0, // swiper组件的current值
      active: 0,
      hotwall: [],
      event: [],
      eventAll: [],
      lasttime: 0, // 下一页
      // 两个item加载
      load: false,
      loading: false,
      // 瀑布加载
      reload: false,
      finished: false
    }
  },
  created () {
    this.getHotwallVillage()
  },
  watch: {
    current (val, oldV) {
      if (val === 1 && this.event.length === 0) this.getEventVillage(0)
    }
  },
  methods: {
		tabsChange(index) {
			this.swiperCurrent = index
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx
			this.$refs.villageTabs.setDx(dx)
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current
			this.$refs.villageTabs.setFinishCurrent(current)
			this.swiperCurrent = current
			this.current = current
		},
    getHotwallVillage () {
      hotwallVillage()
        .then(data => {
          this.hotwall = data.data
          this.$nextTick(() => {
            this.load = true
          })
        })
    },
    // 30个为一组
    getEventVillage (lasttime) {
      eventVillage(30, lasttime)
        .then(data => {
          this.event = data.event
          this.lasttime = data.lasttime
          // 没有数据时停止
          if (!data.more) {
            this.finished = true
            this.loading = true
            this.reload = false
          } else {
            this.division()
          }
        })
    },
    division () {
      this.eventAll.push(...this.event)
      this.$nextTick(() => {
        this.loading = true
        // 加载状态结束
        this.reload = false
      })
    },
    pullDown () {
      if (this.$store.state.loginState) {
        if (!this.finished) {
          this.reload = true
          this.getEventVillage(this.lasttime)
        }
      } else {
        uni.showToast({
					title: '需要登录',
					icon: 'none'
				})
      }
    }
  },
  components: {
    VillageCard,
    Loading,
    DynamicCard
  }
}
</script>
<style lang="scss" scoped>
.village-event {
  position: relative;
  padding-top: 80rpx;
  /* #ifdef APP-PLUS */
  padding-top: $height*0.8;
  /* #endif */
  box-sizing: border-box;
}
// 两竖列
.card-box {
  position: relative;
  // 使用这种方式
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: $width*0.928;
	margin: 0 auto;
  padding-top: $height*0.8;
  /* #ifdef APP-PLUS */
  padding-top: calc(48px + var(--status-bar-height));
  /* #endif */

  // 不兼容
  // column-count: 2;
}
.more {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  width: $width;
  height: 100rpx;
  background-color: #fff;
  border-top: 1px solid #ccc;
}
</style>