export const format = date => {
  const oDate = new Date(date)
  const obj = {
    Y: oDate.getFullYear(),
    M: oDate.getMonth() + 1,
    D: oDate.getDate()
  }
  // 位数不足两位补全0
  function supplement (nn) {
    nn = nn < 10 ? '0' + nn : nn
    return nn
  }
  // yyyy.mm.dd
  return obj.Y + '.' + supplement(obj.M) + '.' + supplement(obj.D)
}
