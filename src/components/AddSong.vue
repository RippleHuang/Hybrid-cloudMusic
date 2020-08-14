<template>
  <view class="add-song">
    <!-- 创建的歌单,不是自己的歌单 添加 -->
    <view class="top">
      <text class="title u-line-1">歌曲:{{name}}</text>
      <text class="title">{{uid !== accountUid ? '添加到' : '删除'}}</text>
    </view>
    <view class="song-group" v-if="uid !== accountUid">
      <scroll-view scroll-y class="action-sheet">
        <song-list-li
          v-for="(item, index) in createList" :key="index"
          :coverImgUrl="item.coverImgUrl"
          :name="item.name"
          :trackCount="item.trackCount"
          :privacy="item.privacy"
          :description="item.description"
          @eventThing="addOrDelSongInList(item.id)"
        />
      </scroll-view>
    </view>
    <!-- 是自己的歌单, 删除 -->
    <text class="delete on-touch" @tap="addOrDelSongInList" v-else>
      <text class="iconfont icon-trash on-touch"></text>
      删除
    </text>
  </view>
</template>
<script>
import { editSong } from '@/api/apis'
import { mapGetters } from 'vuex'
import SongListLi from '@/components/SongListLi'
export default {
  name: 'AddSong',
  props: {
    name: {
      type: String
    },
    uid: {
      type: Number
    },
    createList: {
      type: Array
    },
    albumId: {
      type: Number
    },
    songid: {
      type: Number
    }
  },
  computed: {
    ...mapGetters(['accountUid'])
  },
  methods: {
    addOrDelSongInList (id) {
      const addOrdel = this.uid !== this.accountUid ? 'add' : 'del'
      const text = this.uid !== this.accountUid ? '添加歌曲成功' : '删除歌曲成功'
      // 不是自己的歌单则为传递过来的,是则pid直接为albumId
      const pid = this.uid !== this.accountUid ? id : this.albumId
      editSong(addOrdel, pid, this.songid)
        .then(() => {
          this.$emit('showActionSheet', false)
          uni.showToast({title: text, icon: 'none'})
          this.$store.commit('REFRESH') // 刷新
          if (addOrdel === 'del') {
             uni.navigateBack({
              delta: 1,
              animationType: 'pop-out',
              animationDuration: 200
            })
          }
        })
    }
  },
  components: {
    SongListLi
  }
}
</script>
<style lang='scss' scoped>
.add-song {
  .top {
    position: absolute;
    top: 0;
    width: $width;
    height: 100rpx;
    padding: 20rpx 25rpx;
    font-size: 32rpx;
    color: black;
    line-height: 1.3;
    .title {
      width: $width*0.9;
      font-weight: bold;
    }
  }
  .action-sheet {
    height: 50vh;
    margin-top: 100rpx;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .delete {
    height: 100rpx;
    margin-top: 100rpx;
    padding-left: 20rpx;
    line-height: 100rpx;
    text {
      font-size: 32rpx;
      padding-right: 10rpx;
    }
  }
}
</style>
