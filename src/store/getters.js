export default {
  loginState: (state) => state.loginState,
  accountUid: (state) => state.accountUid,
  level: (state) => state.level,
  nickName: (state) => state.nickName,
  avatarUrl: (state) => state.avatarUrl,
  playState: state => state.playState,
  audioList: state => state.audioList,
  audioIngIndex: state => state.audioIngIndex,
  playList: state => state.playList,
  mode: state => state.mode,
  fullScreen: state => state.fullScreen,
  audioIngSong: state => state.playList[state.audioIngIndex] || {}, // 返回当前播放歌曲对象的信息
  searchHistory: state => { 
    if (Array.isArray(state.searchHistory)) return state.searchHistory
    else return JSON.parse(state.searchHistory)
  },
	audio: state => state.audio,
}
