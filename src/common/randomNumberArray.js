// 从数组中随机取出几个数
export const getRandomNumberArray = (arr, count) => {
  // eslint-disable-next-line one-var
  const shuffled = arr.slice(0)
  // 克隆一个数组，为了不影响外边的数据
  let i = arr.length
  let temp
  let index
  const min = i - count
  // 存下来数组信息  数组的长度
  // 通过改变数组项的位置 输出后边的几位
  while (--i > min) {
    // 随机生成出一个索引
    index = Math.floor((i + 1) * Math.random())
    // 将随机索引项暂存
    // 将数组后边的项与随机项调换
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(min)
}
