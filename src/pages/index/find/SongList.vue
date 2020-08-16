<template>
  <scroll-view>
    <view class="song-list">
      <view class="song-list-header">
        <text class="title">推荐歌单</text>
        <button class="title-btn" plain @tap="goShowList">歌单广场</button>
      </view>
      <view class="song-list-con">
        <img-card
          v-for="(item, index) in songList"
          :key="index"
          :url="item.picUrl || item.coverImgUrl"
          :songtitle="item.name"
          :playCount="item.playCount"
          @goPage="goSongShow(item.id)"
        />
      </view>
    </view>
  </scroll-view>
</template>
<script>
import ImgCard from '@/components/ImgCard'
export default {
  name: 'SongList',
  props: {
    songList: {
      type: Array
    }
  },
  data () {
    return {
      opacity: 0
    }
  },
  methods: {
    goSongShow (id) {
      uni.navigateTo({
				url: `/otherPages/showsong/showSongList?albumId=${id}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    goShowList () {
      uni.navigateTo({
				url: '/otherPages/songListSquare/SongListSquare',
				animationType: 'pop-in',
				animationDuration: 200
			})
    }
  },
  components: {
    ImgCard
  }
}
</script>
<style lang="scss" scoped>
.song-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: $width*0.928;
    height: $height;
    .title {
      font-size: 35rpx;
      font-weight: 900;
    }
    .title-btn {
      border: 1px solid #eaeaea;
    }
  }
  &-con {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: $width*0.928;
  }
}
</style>
