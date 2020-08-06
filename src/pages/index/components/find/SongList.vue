<template>
  <view class="song-list van-hairline--top">
    <view class="song-list-header">
      <text class="title">推荐歌单</text>
      <button class="title-btn" plain @tap="$router.push('/songlistsquare')">歌单广场</button>
    </view>
    <view class="song-list-con">
      <img-card
        v-for="(item, index) in songList"
        :key="index"
        :url="item.picUrl || item.coverImgUrl"
        :songtitle="item.name"
        :playCount="item.playCount"
        @tap.native="$router.push(`/showsong?albumId=${item.id}`)"
      />
    </view>
  </view>
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
