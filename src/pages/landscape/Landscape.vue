<template>
  <view class="landscape">
    <video-card
      :videoData="videoData"
      :type="type"
      dynamic
      landscape
    />
		<view class="empty">
			<text class="iconfont icon-kong"></text>
			<text>尚未施工，尽请期待</text>
		</view>
  </view>
</template>
<script>
import VideoCard from '@/components/VideoCard'
import { videoDetail, mvDetail } from '@/api/apis'
export default {
  name: 'Landscape',
  data () {
    return {
			videoData: [],
			type: 0
    }
  },
	onLoad (option) {
		this.type = option.type * 1
		this.getDetail(option.vid, option.type)
	},
  methods: {
    // 获取视频详情
    getDetail (id) {
      if (this.type === 1) {
        videoDetail(id)
          .then(data => {
            this.videoData = data.data
          })
      } else {
        mvDetail(id)
          .then(data => {
            this.videoData = data.data
          })
      }
    }
  },
  components: {
    VideoCard
  }
}
</script>
<style lang='scss' scoped>
.empty {
  padding-top: $height;
}
</style>
