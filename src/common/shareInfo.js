const types = {
  a18: {
    type: '分享单曲:',
    data: 'song',
    img: 'img80x80',
    name: 'name',
    creatorName: ['artists', 'name']
  },
  a19: {
    type: '分享专辑:',
    data: 'album',
    img: 'picUrl',
    name: 'name',
    creatorName: ['artist', 'name']
  },
  a17: {
    type: '分享电台:',
    data: 'program',
    img: 'img80x80',
    name: 'name',
    creatorName: ['description', 'description']
  },
  a28: {
    type: '分享电台:',
    data: 'djRadio',
    img: 'picUrl',
    name: 'name',
    creatorName: ['dj', 'nickname']
  },
  a22: {
    type: '转发:',
    data: 'event',
    dataJson: 'json'
  },
  a39: {
    type: '发布视频:',
    data: 'video',
    img: 'coverUrl',
    name: 'title',
    creatorName: ['creator', 'nickname']
  },
  a35: {
    type: '分享歌单:',
    data: 'playlist',
    img: 'coverImgUrl',
    name: 'name',
    creatorName: ['creator', 'nickname']
  },
  a13: {
    type: '分享歌单:',
    data: 'playlist',
    img: 'coverImgUrl',
    name: 'name',
    creatorName: ['creator', 'nickname']
  },
  a41: {
    type: '分享视频:',
    data: 'video',
    img: 'coverUrl',
    name: 'title',
    creatorName: ['creator', 'nickname']
  },
  a21: {
    type: '分享视频:',
    data: 'mv',
    img: 'imgurl',
    name: 'name',
    creatorName: ['artistName', 'artistName']
  },
  a24: {
    type: '分享专栏文章:',
    data: 'topic',
    img: 'coverUrl',
    name: 'title',
    creatorName: ['creator', 'nickname']
  },
  a56: {
    type: '分享:',
    data: 'resource',
    img: 'coverImgUrl',
    name: 'title',
    creatorName: ['subTitle', 'subTitle']
  },
  a31: {
    type: '分享:',
    data: 'resource',
    img: 'coverImgUrl',
    name: 'content',
    creatorName: ['resourceName', 'resourceName']
  },
  a33: {
    type: '分享:',
    data: 'no'
  },
  a36: {
    type: '分享:',
    data: 'resource',
    img: 'picUrl',
    name: 'name',
    creatorName: ['name', 'name']
  }
}
export default types
