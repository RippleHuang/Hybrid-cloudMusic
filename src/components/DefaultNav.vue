<template>
	<view class="nav">

		<view class="status_bar">
			<!-- 这里是状态栏 -->
    </view>

		<!-- 主页面导航 -->
		<view class="default-nav">
			<view class="nav-left on-touch" @tap="showPopup">
        <u-icon name="list" size="36"></u-icon>
      </view>
      <view class="tabs">
      	<scroll-view
      		class="scroll-h"
      		:scroll-x="true"
      		:show-scrollbar="false"
      		:scroll-into-view="scrollInto"
      	>
					<view class="nav-box">
						<view
							v-for="(tab, index) in tabBars" :key="tab.id"
							class="uni-tab-item on-touch"
							@tap="activeStyle(index)"
						>
							<text
								class="uni-tab-item-title"
								:class="tabIndex === index ? 'uni-tab-item-title-active' : ''"
							>
							  {{tab.name}}
							</text>
						</view>
					</view>
      	</scroll-view>
      </view>
      <view class="nav-right on-touch" @tap="goSearch">
        <text class="iconfont icon-sousuo"></text>
      </view>
		</view>
	</view>
</template>
<script>
export default {
  name: 'DefaultNav',
	props: {
		tabIndex: {
			type: Number
		}
	},
	data () {
		return {
			scrollInto: '',
			tabBars: [{
				name: '我的',
				id: 'home'
			}, {
				name: '发现',
				id: 'find'
			}, {
				name: '云村',
				id: 'village'
			}, {
				name: '视频',
				id: 'video'
			}]
		}
	},
  methods: {
		activeStyle (index) {
			this.$emit('changeIndex', index)
		},
		showPopup () {
			this.$emit('showPopup')
		},
		goSearch () {
			uni.navigateTo({
				url: '../search/search?search=search',
				animationType: 'pop-in',
				animationDuration: 200
			})
		}
  }
}
</script>
<style lang='scss' scoped>
.nav {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 5;
	width: $width;
	color: #fff;
	background-color: $defaultColor;
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.default-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: $width;
		height: $height;
		.nav-left,
		.nav-right {
			flex: .8;
			height: $height;
			line-height: $height;
			text-align: center;
			border-radius: 0 50% 50% 0;
		}
		.nav-right {
			border-radius: 50% 0 0 50%;
			.icon-sousuo {
				font-size: 28rpx;
			}
		}
		.tabs {
			display: flex;
			justify-content: space-between;
			flex: 4;
			height: $height;
			line-height: $height;
			.nav-box {
				display: flex;
				justify-content: center;
				.uni-tab-item {
					display: inline-flex;
					justify-content: center;
					width: $height;
					color: rgba(255, 255, 255, .7);
					font-size: 30rpx;
					border-radius: 50%;
				}
			}
		}
		.uni-tab-item-title-active {
		  color: #fff;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
}
</style>
