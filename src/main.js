import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//设置全局css
import './assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'

import axios from 'axios'; 
Vue.config.productionTip = false
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use((config)=>{
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http =axios
Vue.component('tree-table', ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
