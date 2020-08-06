module.exports = {
  devServer: {
    // 默认是 localhost如果希望服务器外部可访问，指定如下 host: '0.0.0.0'，设置之后之后可以访问ip地址
    host: '0.0.0.0',
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        /* 目标代理服务器地址 */
        target: 'http://localhost:3000',
        /* 允许跨域 */
        changeOrigin: true,
        // false为http访问，true为https访问
        secure: false,
        // 设置代理
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}