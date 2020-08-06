export default {
  loginState: !!uni.getStorageSync('loginState') || false, // 登陆状态，初始值为 false 未登录，登陆成功设置为 true
  accountUid: uni.getStorageSync('accountUid') * 1 || 0, // 存取用户 uid
  level: uni.getStorageSync('level') * 1 || 0, // 用户等级
  nickName: uni.getStorageSync('nickname') || '', // 用户昵称
  avatarUrl: uni.getStorageSync('avatarUrl') || '', // 用户头像
  playState: false, // 是否正在播放，
  audioList: [], // 用来展示播放列表项
  playList: [], // 用来存储各种播放模式的列表
  mode: 0, // 用来记录当前播放模式 0：列表循环，1：单曲循环 2：随机播放
  audioIngIndex: -1, // 正在播放的这一首歌曲索引
  fullScreen: false, // 是否是全屏展示播放页
  searchHistory: JSON.parse(uni.getStorageSync('keywords')) || [], //  搜索历史
  refreshState: 0 // 刷新
}
