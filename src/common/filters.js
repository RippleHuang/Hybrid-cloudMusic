// 超过一万转化万为单位 向下取整, 超过一亿转化亿为单位 后一位小数四舍五入
export const filterPlayCount = value => {
  if (!value) return ''
  if (value > 100000000) {
    value = (value / 100000000).toFixed(1) + '亿'
  } else if (value > 10000) {
    value = Math.floor(value / 10000) + '万'
  }
  return value
}
// 超过十万转化万为单位 小数点后一位向下取整
// 超过一亿转化亿为单位 后一位小数四舍五入
export const filterPlayCountInfo = value => {
  if (!value) return ''
  if (value > 100000000) {
    value = (value / 100000000).toFixed(1) + '亿'
  } else if (value > 100000) {
    value = (Math.floor(value / 1000) / 10).toFixed(1) + '万'
  }
  return value
}
// 将毫秒转换为 00:00 的形式
export const filterSetTime = value => {
  if (!value) return ''
  let min = parseInt(value / (1000 * 60))
  if (min < 10) {
    min = '0' + min
  }
  let sec = parseInt(value % (1000 * 60) / 1000)
  if (sec < 10) {
    sec = '0' + sec
  }
  value = `${min}:${sec}`
  return value
}
export const setName = val => {
  const reg = /<\/?.+?\/?>/g
  val = val.replace(reg, '')
  return val
}
// 将毫秒根据情况转换为 年 月 日 时:分
export const filterSetDate = (value) => {
  const oDate = new Date(value)
  const oYear = oDate.getFullYear()
  const oMonth = oDate.getMonth() + 1
  const oDay = oDate.getDate()
  const h = oDate.getHours()
  const m = oDate.getMinutes()
  // 现在时间
  const now = new Date()
  // 位数不足两位补全0
  function supplement (nn) {
    nn = nn < 10 ? '0' + nn : nn
    return nn
  }
  // 拼接时间 hh:mm
  const time = ' ' + supplement(h) + ':' + supplement(m)
  if (now.getFullYear() > oYear) {
    value = `${oYear}年${oMonth}月${oDay}日`
  } else if (now.getMonth() + 1 > oMonth) {
    value = `${oMonth}月${oDay}日`
  } else if (now.getDate() > oDay) {
    value = now.getDate() - 1 === oDay ? `昨天 ${time}` : `${oMonth}月${oDay}日`
  } else if (now.getHours() > h) {
    const minutes = now.getMinutes() - m >= 0 ? time : `${60 + now.getMinutes() - m}分钟前`
    value = now.getHours() - 1 === h ? minutes : time
  } else if (now.getHours() === h) {
    value = now.getMinutes() - m <= 0 ? '刚刚' : `${now.getMinutes() - m}分钟前`
  }
  return value
}
export const filterAge = time => {
  if (!time) {
    // 这里是因为默认值为0的话会返回1970
    // 当传入默认值退出
    return
  }
  const year = new Date(time).getFullYear()
  const nowYear = new Date().getFullYear()
  let age = ''
  // 存下从1950年到现在时间每5年一个间隔的数值
  const ages = []
  for (let i = 1950; i < nowYear; i += 5) {
    ages.push(i)
  }
  for (let i = 0; i < ages.length; i++) {
    const ele = ages[i]
    if (year <= ele + 5) {
      // 找到第一个满足条件的年份，拆分成数组，截取最后两位，组合返回
      age = ele.toString().split('').splice(-2).join('')
      break
    }
  }
  return age
}
