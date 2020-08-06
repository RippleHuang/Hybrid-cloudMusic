// 打乱一个数组
export const shuffle = arr => {
  // 获取随机值
  function getRandomIndex (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomIndex(0, i)
    const t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export const findIndex = function (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
