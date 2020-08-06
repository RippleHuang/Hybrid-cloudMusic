// 接收组件通知触发mutations调用间接改变状态方法的对象
import {
  SET_PLAY_SATE,
  SET_AUDIO_LIST,
  SET_AUDIO_INDEX,
  SET_AUDIO_MODE,
  SET_PLAY_LIST,
  SET_FULL_SCREEN
} from './mutations-types'
import { shuffle, findIndex } from '../common/actionsArray.js'
export default {
  // 点击歌曲项进行播放
  selectPlay ({ commit, state }, { list, index }) {
    commit(SET_AUDIO_LIST, list)
    if (state.mode === 2) {
      const randomList = shuffle(list)
      commit(SET_PLAY_LIST, randomList)
      index = findIndex(randomList, state.audioList[index])
    } else {
      commit(SET_PLAY_LIST, list)
    }
    commit(SET_AUDIO_INDEX, index)
    commit(SET_PLAY_SATE, true)
  },
  // 播放全部 传入播放列表
  startPlayAll ({ commit }, { list }) {
    // 数组对象去重,根据id
    var result = []
    var obj = {}
    for (var i = 0; i < list.length; i++) {
      if (!obj[list[i].id]) {
        result.push(list[i])
        obj[list[i].id] = true
      }
    }
    commit(SET_AUDIO_LIST, result)
    commit(SET_AUDIO_INDEX, 0)
    commit(SET_PLAY_LIST, result)
    commit(SET_PLAY_SATE, true)
    commit(SET_AUDIO_MODE, 0)
    commit(SET_FULL_SCREEN, true)
  },
  // 清空播放列表
  clearPlayAll ({ commit }) {
    commit(SET_AUDIO_LIST, [])
    commit(SET_AUDIO_INDEX, -1)
    commit(SET_PLAY_LIST, [])
    commit(SET_PLAY_SATE, false)
    commit(SET_AUDIO_MODE, 0)
    commit(SET_FULL_SCREEN, false)
  },
  // 向播放列表添加歌曲 当播放列表为空时添加后开始播放
  addToAudioList ({ commit, state }, song) {
    const audioList = state.audioList
    const playList = state.playList
    let currentIndex = state.audioIngIndex
    // 记录当前歌曲
    const audioIng = audioList[currentIndex]
    // 查找当前列表中是否有要插入的歌曲,并返回它的索引
    const findAudioIndex = findIndex(audioList, song)
    // 因为是插入歌曲，所以索引要+1
    currentIndex++
    // 插入这首歌到当前索引位置
    audioList.splice(currentIndex, 0, song)
    // 如果已经有了这首歌
    if (findAudioIndex > -1) {
      // 如果当前插入序号大于列表中的序号
      if (currentIndex > findAudioIndex) {
        audioList.splice(findAudioIndex, 1)
        currentIndex--
      } else {
        audioList.splice(currentIndex + 1, 1)
      }
    }
    const currentPlayIndex = findIndex(playList, audioIng) + 1
    const findPlayIndex = findIndex(playList, song)
    playList.splice(currentPlayIndex, 0, song)
    if (findPlayIndex > -1) {
      if (currentPlayIndex > findPlayIndex) {
        playList.splice(findPlayIndex, 1)
      } else {
        playList.splice(findPlayIndex + 1, 1)
      }
    }
    commit(SET_AUDIO_INDEX, currentIndex)
    commit(SET_PLAY_SATE, true)
  },
  deleteSong ({ commit, state }, song) {
    const audioList = state.audioList.slice()
    const playList = state.playList.slice()
    let currentIndex = state.audioIngIndex
    // 删除的歌曲是当前播放歌曲之前
    const pIndex = findIndex(audioList, song)
    audioList.splice(pIndex, 1)
    // 删除的歌曲是当前歌曲之后
    const sIndex = findIndex(playList, song)
    playList.splice(sIndex, 1)

    if (currentIndex > pIndex || currentIndex === audioList.length) {
      currentIndex--
    }
    commit(SET_AUDIO_LIST, audioList)
    commit(SET_PLAY_LIST, playList)
    commit(SET_AUDIO_INDEX, currentIndex)
    if (!audioList.length) {
      commit(SET_PLAY_SATE, false)
    }
  }
}
