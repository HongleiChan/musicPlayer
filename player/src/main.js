// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/stylus/index.styl'
import axios from  'axios'
import VueLazyload from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueLazyload,{
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
fastclick.attach(document.body)
Vue.prototype.$axios = axios;

new Vue({
  el: '#app',
  render:h=>h(App),
  router, 
  store,
  template: '<App/>  '
})
