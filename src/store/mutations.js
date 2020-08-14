// 包含多个由actions触发直接去更新状态的方法对象
import {
  LOGIN_STATE,
  SET_LEVEL,
  ACCOUNT_UID,
  LOGIN_OUT,
  NICK_NAME,
  AVATAR_URL,
  SET_PLAY_SATE,
  SET_AUDIO_LIST,
  SET_AUDIO_INDEX,
  SET_AUDIO_MODE,
  SET_PLAY_LIST,
  SET_FULL_SCREEN,
  SET_HISTORY,
  CLEAR_HISTORY,
  REFRESH
} from './mutations-types'
export default {
  // 用户状态
  [LOGIN_STATE] (state, boole) {
    state.loginState = boole
    uni.setStorageSync('loginState', boole)
  },
  // 用户等级
  [SET_LEVEL] (state, lv) {
    state.level = lv
    uni.setStorageSync('level', lv)
  },
  // 用户uid
  [ACCOUNT_UID] (state, uid) {
    state.accountUid = uid
    uni.setStorageSync('accountUid', uid)
  },
  // 用户昵称
  [NICK_NAME] (state, nickname) {
    state.nickName = nickname
    uni.setStorageSync('nickname', nickname)
  },
  // 用户头像
  [AVATAR_URL] (state, avatarUrl) {
    state.avatarUrl = avatarUrl
    uni.setStorageSync('avatarUrl', avatarUrl)
  },
  // 退出
  [LOGIN_OUT] (state) {
    uni.clearStorageSync()
    state.level = 0
    state.accountUid = 0
    state.nickName = ''
    state.avatarUrl = ''
    state.loginState = false
  },
  // 播放状态
  [SET_PLAY_SATE] (state, boole) {
    state.playState = boole
  },
  // 播放列表信息
  [SET_AUDIO_LIST] (state, list) {
    state.audioList = list
  },
  // 索引
  [SET_AUDIO_INDEX] (state, index) {
    state.audioIngIndex = index
  },
  // 播放列表
  [SET_PLAY_LIST] (state, list) {
    state.playList = list
  },
  // 播放模式
  [SET_AUDIO_MODE] (state, mode) {
    state.mode = mode
  },
  // 全屏播放器或迷你播放器
  [SET_FULL_SCREEN] (state, boole) {
    state.fullScreen = boole
  },
  // 搜索历史
  [SET_HISTORY] (state, keyword) {
    // 判断是否有
    if (uni.getStorageSync('keywords')) {
      // 得到存储值并向前添加新值
      const oldA = JSON.parse(uni.getStorageSync('keywords'))
      oldA.unshift(keyword)
      // 去重
      const newA = [...new Set(oldA)]
      state.searchHistory = newA
      uni.setStorageSync('keywords', JSON.stringify(newA))
    } else {
      state.searchHistory = [keyword]
      uni.setStorageSync('keywords', JSON.stringify([keyword]))
    }
  },
  // 清除搜索历史
  [CLEAR_HISTORY] (state) {
    state.searchHistory = []
    uni.removeStorageSync('keywords')
  },
  // 页面刷新
  [REFRESH] (state) {
    state.refreshState = +new Date()
  }
}
