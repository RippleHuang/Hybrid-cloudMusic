import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import store from 'store'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)


const app = new Vue({
	store,
  ...App
})
// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/api/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)
app.$mount()
