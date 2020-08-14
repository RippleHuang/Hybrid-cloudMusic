import CryptoJS from 'crypto-js'
export const encrypt = (word, keyStr) => { // 加密
  const encrypted = CryptoJS.AES.encrypt(word, keyStr)
  return encrypted.toString()
}
export const decrypt = (word, keyStr) => { // 解密
  const decrypt = CryptoJS.AES.decrypt(word, keyStr)
  return decrypt.toString(CryptoJS.enc.Utf8)
}
