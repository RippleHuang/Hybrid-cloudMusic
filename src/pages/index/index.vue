<template>
	<view class="content">
		<!-- 可移动选项卡 -->
		<default-nav @changeIndex="changeIndex" :tabIndex="activeIndex" @showPopup="show = !show" />
		<swiper
			class="tabs-swiper"
			:current="activeIndex"
			@change="tabChange"
		>
			<swiper-item class="tab-swiper-item">
				<home-index />
			</swiper-item>
			<swiper-item class="tab-swiper-item">
				<find-index />
			</swiper-item>
			<swiper-item class="tab-swiper-item">
				<village-index />
			</swiper-item>
			<swiper-item class="tab-swiper-item">
				<video-index />
			</swiper-item>
		</swiper>
		<u-popup v-model="show" mode="left">
			<left-popup :visible="show" />
		</u-popup>
	</view>
</template>

<script>
import DefaultNav from '@/components/DefaultNav'
import HomeIndex from './components/home/index'
import FindIndex from './components/find/index'
import VillageIndex from './components/village/index'
import VideoIndex from './components/video/index'
import LeftPopup from './LeftPopup'
export default {
	data() {
		return {
			list: [],
			activeIndex: 1,
			show: false
		}
	},
	onLoad() {

	},
	methods: {
		changeIndex (index) {
			this.activeIndex = index
		},
		tabChange (e) {
			this.activeIndex = e.detail.current
		}
	},
	components: {
		DefaultNav,
		HomeIndex,
		FindIndex,
		VillageIndex,
		VideoIndex,
		LeftPopup
	}
}
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: $height;
}
</style>
