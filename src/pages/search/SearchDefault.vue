<template>
  <view class="search-default">
    <loading :height="4.58" :style="[{display: loading ? 'flex' : 'none'}]" />
    <view class="search-container" :style="[{display: !loading ? 'block' : 'none'}]">
      <!-- 历史记录 -->
      <view class="history" v-if="history.length">
        <view class="top">
          <text class="title">历史记录</text>
          <text class="iconfont icon-trash" @tap="clearSearch"></text>
        </view>
        <view class="history-box">
          <view class="tag-group">
            <view
              class="tags-item"
              v-for="(item, index) in history" :key="index"
              @tap="goSearch(item)"
            >
              {{item}}
            </view>
          </view>
        </view>
      </view>
      <!-- 热搜榜 -->
      <view class="hot-search">
        <text class="hot-title">热搜榜</text>
        <view class="hot-group">
          <view
            class="hot-item on-touch"
            v-for="(item, index) in hotList" :key="index"
            @tap="goSearch(item.searchWord)"
          >
            <text class="num">{{ index + 1 }}</text>
            <view class="song-center">
              <view class="song-info">
                <text>{{ item.searchWord }}</text>
                <image
                  class="search-logo"
                  :style="[{width: item.iconType === 5 ? '12px' : '22.5px'}]"
                  v-if="item.iconUrl"
                  :src="item.iconUrl"
                />
              </view>
              <text class="song-content">{{ item.content }}</text>
            </view>
            <text class="score">{{ item.score }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { hotSearchList } from '@/api/apis'
import Loading from '@/components/Loading'
import { mapGetters } from 'vuex'
export default {
  name: 'SearchDefault',
  data () {
    return {
      loading: true,
      hotList: [],
      history: []
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  created () {
    this.getHotSearchList()
    const history = this.searchHistory
    if (history.length !== 0) this.history = JSON.parse(history)
  },
  methods: {
    getHotSearchList () {
      hotSearchList()
        .then(data => {
          this.hotList = data.data
          this.$nextTick(() => {
            this.loading = false
          })
        })
    },
    clearSearch () {
      this.$store.commit('CLEAR_HISTORY')
    },
    // 去搜索页并保存历史记录
    goSearch (keyword) {
      this.$store.commit('SET_HISTORY', keyword)
      uni.navigateTo({
        url: `../searchresult/searchresult?search=searchResult&text=${keyword}`,
        animationType: 'pop-in',
        animationDuration: 200
      })
    }
  },
  components: {
    Loading
  }
}
</script>
<style lang='scss' scoped>
.search-default {
  padding-top: $height;
  height: 100vh;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .history {
    padding: 30rpx 40rpx 0;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      .title {
        color: black;
        font-size: 32rpx;
        font-weight: bold;
      }
      .icon-trash {
        color: rgb(136, 132, 132);
        font-size: 32rpx;
      }
    }
    .history-box {
      overflow-x: scroll;
      // 隐藏滚动条 火狐 IE 谷歌
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .tag-group {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        width: max-content;
        .tags-item {
          display: inline-block;
          height: 60rpx;
          padding: 0 20rpx;
          margin-right: 30rpx;
          line-height: 60rpx;
          text-align: center;
          color: black;
          background-color: rgb(236, 231, 231);
          border-radius: 30rpx;
        }
      }
    }
  }
  .hot-search {
    margin-top: 80rpx;
    .hot-title {
      margin-left: 40rpx;
      font-size: 32rpx;
      font-weight: bold;
    }
    .hot-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10rpx 40rpx;
      color: #888;
      font-size: 24rpx;
      @mixin hotpublic {
        .num {
          color: $defaultColor;
        }
        .song-info {
          font-weight: bold;
          font-size: 34rpx;
        }
      }
      &:nth-of-type(1) {
        @include hotpublic;
      }
      &:nth-of-type(2) {
        @include hotpublic;
      }
      &:nth-of-type(3) {
        @include hotpublic;
      }
      .num {
        width: 40rpx;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        font-size: 35rpx;
      }
      .song-center {
        width: $width*0.6;
        .song-info {
          padding: 10rpx 0;
          color: black;
          font-size: 32rpx;
          .search-logo {
            margin: -10rpx 0 0 10rpx;
            height: 25rpx;
          }
        }
      }
      .score {
        width: $height;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        font-size: 24rpx;
      }
    }
  }
}
</style>
