import Vue from 'vue'
const vm = new Vue()
// ======登陆======
export const phoneLogin = (phone, password) => vm.$u.post(`/login/cellphone?timestamp=${+new Date()}`, { phone, password }) // 手机号登陆 参数 手机号 密码
export const phoneRegistered = phone => vm.$u.post(`/cellphone/existence/check?timestamp=${+new Date()}`, { phone })// 手机号是否被注册 参数 手机号
export const sendVerify = phone => vm.$u.post(`/captcha/sent?timestamp=${+new Date()}`, { phone }) // 发送验证码 参数 手机号
export const verify = (phone, captcha) => vm.$u.post(`/captcha/verify?timestamp=${+new Date()}`, { phone, captcha }) // 验证验证码 参数 手机号 验证码
export const loginStatus = () => vm.$u.get(`/login/status?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`) // 获得登录状态
export const logout = () => vm.$u.get(`/logout?timestamp=${+new Date()}`) // 退出登录
export const signIn = type => vm.$u.post(`/daily_signin?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { type }) // 签到 type 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
export const register = (phone, password, captcha, nickname) => vm.$u.post(`/register/cellphone?timestamp=${+new Date()}`, { phone, password, captcha, nickname }) // 注册修改密码 参数 手机号 密码 验证码 昵称, 修改密码可以不需要昵称
// ======发现页面======
export const bannerSwiper = (type = 1) => vm.$u.get('/banner', { type }) // 发现页面轮播图
export const recSongList = (limit, cat, offset, order) => vm.$u.post(`/top/playlist?timestamp=${+new Date()}`, { limit, cat, offset, order }) // 推荐歌单 参数 取出数量 tag 偏移量 最新或最热
export const highQuality = (limit, before, cat) => vm.$u.post(`/top/playlist/highquality?timestamp=${+new Date()}`, { limit, before, cat }) // 精品歌单 参数 取出数量 页数 tag
export const topList = () => vm.$u.get('/toplist/detail') // 获取所有榜单内容
export const playlistDetail = (id, s) => vm.$u.post(`/playlist/detail?timestamp=${+new Date()}`, { id, s }) // 获取歌单详情 id-歌单 最近的 s 个收藏者
export const songInfo = ids => vm.$u.post(`/song/detail?timestamp=${+new Date()}`, { ids }) // 歌曲详情 参数 歌曲id, 可多个,逗号分开
export const recSongs = () => vm.$u.get(`/recommend/songs?cookie=${uni.getStorageSync('cookie')}`) // 每日推荐歌曲
export const loginRecSongList = () => vm.$u.get(`/recommend/resource?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`) // 每日推荐歌单，登录后
export const newDish = (limit, offset) => vm.$u.post(`/top/album?timestamp=${+new Date()}`, { limit, offset }) // 发现页新碟, 参数 个数 默认50 页数
export const albumDetail = id => vm.$u.post(`/album?timestamp=${+new Date()}`, { id }) // 获取专辑内容 参数 专辑id
export const albumDetailDynamic = id => vm.$u.post(`/album/detail/dynamic?timestamp=${+new Date()}`, { id }) // 获取专辑动态内容 参数 专辑id
export const findNewSong = () => vm.$u.get('/personalized/newsong') // 发现页新歌
export const newSongs = type => vm.$u.post(`/top/song?timestamp=${+new Date()}`, { type }) // 最新音乐 参数 类型
export const personalFm = () => vm.$u.get('/personal_fm') // 发现页私人FM
// ======我的或用户页面======
export const userRecord = (uid, type) => vm.$u.post(`/user/record?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { uid, type }) // 用户播放记录 参数 用户id, 类型, type为1返回weekData,0返回allData
export const userInfo = uid => vm.$u.post(`/user/subcount?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { uid }) // 用户信息
export const userDetail = uid => vm.$u.post(`/user/detail?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { uid }) // 用户详情 参数 用户id
export const userEvent = (uid, limit, lasttime) => vm.$u.post(`/user/event?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { uid, limit, lasttime }) // 用户动态 参数 用户id 返回数量,默认30 返回数据的lasttime,默认-1
export const playlist = uid => vm.$u.post(`/user/playlist?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { uid }) // 用户歌单 参数 用户id
export const favoriteAlbums = (limit, offset) => vm.$u.post(`/album/sublist?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { limit, offset }) // 获取收藏的专辑 参数 取出数量 默认为 25 页数, 默认0
export const favoriteArtists = () => vm.$u.get(`/artist/sublist?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`) // 获取收藏的歌手
export const favoriteVideos = () => vm.$u.get(`/mv/sublist?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`) // 获取收藏的视频
export const djSublist = () => vm.$u.get(`/dj/sublist?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`) // 获取订阅的电台
// ======云村页面======
export const hotwallVillage = () => vm.$u.get('/comment/hotwall/list') // 获取云村热评
export const eventVillage = (pagesize, lasttime) => vm.$u.post(`/event?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { pagesize, lasttime }) // 获取动态消息 参数 每页个数 页数
// ======视频页面======
export const videoTag = () => vm.$u.get('/video/group/list') // 获取视频标签导航
export const videoGroup = (id, offset) => vm.$u.post(`/video/group?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { id, offset }) // 获取对应标签的视频详情 参数 标签id 页数
export const videoUrl = id => vm.$u.post(`/video/url?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { id }) // 获取视频播放地址 参数 视频id
export const mvUrl = id => vm.$u.post(`/mv/url?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { id }) // 获取mv播放地址 参数 mv id
export const videoDetail = id => vm.$u.post(`/video/detail?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { id }) // 获取视频详情 参数 视频id
export const mvDetail = mvid => vm.$u.post(`/mv/detail?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { mvid }) // 获取mv详情 参数 mv的id
// ======搜索页面======
export const search = (keywords, limit, offset, type) => vm.$u.post(`/search?timestamp=${+new Date()}`, { keywords, limit, offset, type }) // 搜索关键词 参数 关键字 返回数量,默认30  页数 类型
export const defaultSearch = () => vm.$u.get(`/search/default?timestamp=${+new Date()}`)// 默认搜索关键词
export const hotSearchList = () => vm.$u.get('/search/hot/detail')// 热搜列表
export const suggestSearch = (keywords, type = 'mobile') => vm.$u.post(`/search/suggest?timestamp=${+new Date()}`, { keywords, type }) // 搜索建议 参数 关键字 类型
export const singerClass = () => vm.$u.post('/artist/list')// 歌手分类
// ======播放歌曲======
export const songUrl = (id, br) => vm.$u.post(`/song/url?timestamp=${+new Date()}`, { id, br })// 获取歌曲url 参数 音乐id 码率,默认最大码率
export const checkSong = (id, br) => vm.$u.post(`/check/music?timestamp=${+new Date()}`, { id, br })// 查看歌曲是否可用 参数 音乐id 码率,默认最大码率
export const songLyric = id => vm.$u.post(`/lyric?timestamp=${+new Date()}`, { id })// 获取歌词 参数 音乐id
export const heartMode = (id, pid, sid) => vm.$u.post(`/playmode/intelligence/list?cookie=${uni.getStorageSync('cookie')}&`, { id, pid, sid })// 心动模式播放 参数 歌曲id 歌单id 要开始播放的歌曲id
export const likeMusicList = uid => vm.$u.post(`/likelist?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { uid })// 喜欢歌曲列表 参数 用户uid
export const likeMusic = (id, like) => vm.$u.post(`/like?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { id, like })// 喜欢歌曲 参数 音乐id 布尔值like
// 歌曲或歌单操作
export const editFavoritePlayList = (t, id) => vm.$u.post(`/playlist/subscribe?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { t, id }) // 收藏/取消收藏歌单 参数 t 1收藏 2取消收藏 歌单id
export const editFavoriteAlbum = (t, id) => vm.$u.post(`/album/sub?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { t, id }) // 收藏/取消收藏专辑 参数 t 1收藏 2取消收藏 歌单id
export const editSong = (op, pid, tracks) => vm.$u.post(`/playlist/tracks?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { op, pid, tracks }) // 对歌单添加或删除歌曲 参数op add添加，del删除 歌单id 歌曲id
export const playlistAdd = (name, privacy) => vm.$u.post(`/playlist/create?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { name, privacy }) // 添加歌单 参数 歌单名 是否隐私歌单,默认否,10为隐私
export const playlistUpdata = (id, name, desc, tags) => vm.$u.post(`/playlist/update?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { id, name, desc, tags }) // 歌单信息更新 参数 歌单id 歌单名 描述 标签
export const playlistDelete = id => vm.$u.post(`/playlist/delete?cookie=${uni.getStorageSync('cookie')}&timestamp=${+new Date()}`, { id }) // 删除歌单 参数 歌单id

