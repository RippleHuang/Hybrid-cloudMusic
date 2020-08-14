<template>
  <view class="search-input">
    <view
      class="rollback on-touch"
      @tap="goBack"
    >
      <text class="iconfont icon-zuo"></text>
    </view>
    <view class="search-con">
      <input
        class="search-text"
        type="text"
        v-model="search"
        :placeholder="placeholder"
        @input="getResult"
        @focus="getResult"
        placeholder-style="color: #eee;font-size: 18px;font-weight: bold;"
        :style="[{'border-color': borderColor}]"
      />
      <text @tap.stop="clearSearch" class="iconfont icon-chahao" :style="[{display: search ? 'block' : 'none'}]"></text>
    </view>
    <view class="mask" @tap="show = false" :style="[{display: show ? 'block':'none'}]"></view>
    <!-- 搜索建议列表信息 -->
    <view class="search-list" :style="[{display: show ? 'block':'none'}]">
      <view class="van-ellipsis on-touch" @tap="searchShow(search)"><text class="text">搜索{{`"${search}"`}}</text></view>
      <view
        class="van-ellipsis on-touch"
        v-for="(item, index) in searchList" :key="index"
        @tap="searchShow(item.keyword)"
      >
        <text class="iconfont icon-sousuo"></text>
        {{ item.keyword }}
      </view>
    </view>
  </view>
</template>
<script>
import { defaultSearch, suggestSearch } from '@/api/apis'
export default {
  name: 'SearchInput',
  props: {
    text: {
      type: String
    },
    searchPage: {
      type: String
    }
  },
  data () {
    return {
      search: '',
      placeholder: '',
      searchList: '',
      borderColor: '',
      // 搜索提示列表
      show: false,
      focus: true
    }
  },
  watch: {
    searchPage: {
      handler (val, oldV) {
        if (val === 'searchResult') {
          this.search = this.text
        }
      },
      immediate: true
    },
    search: {
      handler (val, oldV) {
        this.$nextTick(() => {
          this.borderColor = val ? '#fff' : '#ddd'
        })
        // 为空请求
        if (val === '') {
          this.getDefaultSearch()
          this.show = false
        }
      },
      immediate: true
    }
  },
  methods: {
    goBack () {
      uni.navigateBack({
        delta: 1,
        animationType: 'pop-out',
        animationDuration: 200
      })
      this.show = false
    },
    clearSearch () {
      this.search = ''
    },
    // 进入页面获取默认提示
    getDefaultSearch () {
      defaultSearch()
        .then(data => {
          this.placeholder = data.data.showKeyword
        })
    },
    // 获取搜索提示列表
    getSuggestSearch (keyword) {
      suggestSearch(keyword)
        .then(data => {
          this.searchList = data.result.allMatch
        })
    },
    getResult (e) {
      // 去除前后空格
      this.search = this.search.replace(/^[\s*]|[\s*]$/g, '')
      // 不为空搜索
      if (this.search) {
        this.debounce(this.getSuggestSearch(this.search), 100)
        // 显示列表
        this.show = true
      } else {
        // 隐藏列表
        this.show = false
      }
    },
    // 防抖
    debounce (fn, delay) {
      let timer = null
      return function () {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(fn, delay)
      }
    },
    // 去搜索页或搜索
    searchShow (keyword) {
      this.$store.commit('SET_HISTORY', keyword) // 保存历史
      this.search = keyword
      this.show = false
      if (!this.text) {
        uni.navigateTo({
          url: `../searchresult/searchresult?search=searchResult&text=${keyword}`,
          animationType: 'pop-in',
          animationDuration: 200
        })
      } else {
        this.$emit('searchResult', keyword)
      }
      // 隐藏列表
      this.show = false
    }
  }
}
</script>
<style lang='scss' scoped>
.search-input {
  position: fixed;
  display: flex;
  z-index: 5;
  width: $width;
  height: $height;
  /* #ifdef APP-PLUS */
  padding-top: calc(var(--status-bar-height) / 2);
  /* #endif */
  background-color: $defaultColor;
  .rollback {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $height;
    height: $height;
    border-radius: 50%;
    .icon-zuo {
      font-size: 45rpx;
      color: #fff;
    }
  }
  // 搜索框
  .search-con {
    position: relative;
    display: flex;
    align-items: center;
    height: $height;
    flex: 1;
    .search-text {
      width: $width*0.79;
      height: 60rpx;
      position: relative;
      font-size: 36rpx;
      color: #eee;
      caret-color: #fff;
      background-color: $defaultColor;
      border-bottom: 1rpx solid #ddd;
    }
    .icon-chahao {
      position: absolute;
      z-index: 10;
      right: 25rpx;
      bottom: 35rpx;
      display: none;
      font-size: 50rpx;
      color: #fff;
    }
  }
  // 蒙版, 点击隐藏
  .mask {
    position: absolute;
    left: 0;
    top: $height;
    z-index: 5;
    width: $width;
    height: 100vh;
    background-color: transparent;
  }
  // 列表
  .search-list {
    position: absolute;
    left: 40rpx;
    top: $height;
    z-index: 6;
    width: $width*0.9;
    box-shadow: 0 4px 16px #aaa;
    background-color: #fff;
    view {
      height: 80rpx;
      padding: 20rpx;
      line-height: 50rpx;
      color: #888;
      font-size: 26rpx;
      border-bottom: 1rpx solid rgb(236, 235, 235);
      box-sizing: border-box;
      .text {
        color: rgb(51, 131, 243);
      }
      .icon-sousuo {
        margin-right: 15rpx;
        font-size: 26rpx;
      }
    }
  }
}
</style>
