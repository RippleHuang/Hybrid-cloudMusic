<template>
  <div class="add-song">
    <!-- 创建的歌单,不是自己的歌单 添加 -->
    <div class="top">
      <p class="title van-ellipsis">歌曲:{{name}}</p>
      <p class="title">{{uid !== accountUid ? '添加到' : '删除'}}</p>
    </div>
    <ul class="song-group" v-if="uid !== accountUid">
      <div class="action-sheet">
        <song-list-li
          v-for="(item, index) in createList" :key="index"
          :coverImgUrl="item.coverImgUrl"
          :name="item.name"
          :trackCount="item.trackCount"
          :privacy="item.privacy"
          :description="item.description"
          @click.native="addOrDelSongInList(item.id)"
        />
      </div>
    </ul>
    <!-- 是自己的歌单, 删除 -->
    <p class="delete on-touch" @click="addOrDelSongInList" v-else>
      <i class="iconfont icon-trash on-touch"></i>
      删除
    </p>
  </div>
</template>
<script>
import { editSong } from 'api/apis'
import { mapGetters } from 'vuex'
import SongListLi from 'components/SongListLi'
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
          this.$emit('update:showActionSheet', false)
          this.$toast(text)
          this.$store.commit('REFRESH') // 刷新
          if (addOrdel === 'del') this.$router.go(-1)
        })
        .catch(() => {
          this.$toast('添加歌曲失败')
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
    width: 100%;
    height: 1rem;
    padding: .2rem .25rem;
    font-size: .32rem;
    color: black;
    line-height: 1.3;
    .title {
      width: 90%;
      font-weight: bold;
    }
  }
  .action-sheet {
    height: 55vh;
    margin-top: 1rem;
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .delete {
    height: 1rem;
    margin-top: 1rem;
    padding-left: .2rem;
    line-height: 1rem;
    i {
      font-size: .32rem;
      padding-right: .1rem;
    }
  }
}
</style>
