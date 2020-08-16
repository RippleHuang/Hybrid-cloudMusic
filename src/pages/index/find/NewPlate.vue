<template>
  <view class="plate-list">
    <view class="plate-list-header">
      <view class="header">
        <text :class="[{ active: typeStr === 'plate'}]" @tap="typeStr='plate'" class="title">新碟</text>
        <text :class="[{ active: typeStr === 'newSong'}]" @tap="typeStr='newSong'" class="title2">新歌</text>
      </view>
      <button
        v-show="typeStr === 'plate'"
        class="title-btn"
        plain
        @tap="goPlate"
      >
        更多新碟
      </button>
      <button
        v-show="typeStr === 'newSong'"
        class="title-btn"
        plain
        @tap="goNewSong"
      >
        新歌推荐
      </button>
    </view>
    <view class="plate-list-con" :style="[{opacity}]">
      <view class="images-con" :style="[{display: typeStr==='plate' ? 'flex' : 'none'}]">
        <img-card
          v-for="(item, index) in dishList"
          :key="index"
          :url="item.picUrl"
          :songtitle="item.name"
          @goPage="goSongShow(item.id)"
        />
      </view>
      <view class="images-con" :style="[{display: typeStr==='newSong' ? 'flex' : 'none'}]">
        <img-card
          v-for="(item, index) in newSongsList"
          :key="index"
          :url="item.song.album.blurPicUrl"
          :songtitle="item.song.name"
          :newPlatetype="typeStr"
          @goPage="$store.dispatch('addToAudioList', item.song)"
          @loadingImg="loadingImg"
        />
      </view>
    </view>
  </view>
</template>
<script>
import ImgCard from '@/components/ImgCard'
import { newDish, findNewSong } from '@/api/apis'
import { getRandomNumberArray } from '@/common/randomNumberArray'
export default {
  name: 'NewPlate',
  data () {
    return {
      dishList: [],
      newSongsList: [],
      typeStr: 'plate',
      opacity: 0,
      total: 0 // 新碟总数
    }
  },
  async created () {
    await this.getNewDish()
    await this.getNewSongs()
  },
  methods: {
    goSongShow (id) {
      uni.navigateTo({
				url: `/otherPages/showsong/showSongList?dishId=${id}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    getNewDish () {
      const limit = 10
      newDish(limit)
        .then(data => {
          this.dishList = getRandomNumberArray(data.albums, 3)
          this.total = data.total
        })
    },
    getNewSongs () {
      findNewSong()
        .then(data => {
          this.newSongsList = getRandomNumberArray(data.result, 3)
        })
    },
    goPlate () {
      uni.navigateTo({
				url: '/otherPages/moreNewPlate/MoreNewPlate',
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    goNewSong () {
      uni.navigateTo({
				url: '/otherPages/newSongs/NewSongs',
				animationType: 'pop-in',
				animationDuration: 200
			})
    },
    loadingImg (data) {
      this.$nextTick(() => {
        this.opacity = data ? 1 : 0
      })
    }
  },
  components: {
    ImgCard
  }
}
</script>
<style lang="scss" scoped>
.plate-list {
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
    .header {
      display: flex;
      align-items: flex-end;
      text {
        display: flex;
        align-items: flex-end;
        color: rgba(0, 0, 0, .4);
        font-size: 34rpx;
      }
      .title {
        width: 100rpx;
        height: 38rpx;
        box-sizing: border-box;
        border-right: 1px solid rgba(0, 0, 0, .2);
      }
      .title2 {
        margin-left: 30rpx;
      }
      .active {
        font-size: 38rpx;
        font-weight: 900;
        color: rgba(0, 0, 0, .9);
      }
    }
    .title-btn {
      border: 1px solid #eaeaea;
    }
  }
  &-con {
    display: flex;
    justify-content: space-around;
    width: $width;
    .images-con {
      display: flex;
      justify-content: space-between;
      width: $width*0.928;
    }
  }
}
</style>
