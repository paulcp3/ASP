/* eslint-disable no-new */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Cookies from 'js-cookie'
import {Loading} from 'element-ui'
import ElementUI from 'element-ui'
import GeminiScrollbar from "vue-gemini-scrollbar"
import iView from 'iview';

/*  UI 组件 */
import './assets/style/css.less'
import './assets/style/public.css'
import './assets/style/login.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/animate.min.css'
import 'iview/dist/styles/iview.css'


import'../static/Ueditor/ueditor.config.js'
import'../static/Ueditor/ueditor.all.min.js'
import'../static/Ueditor/lang/zh-cn/zh-cn.js'
// import'../static/Ueditor/ueditor.parse.min.js'


Vue.use(Loading.directive);
Vue.use(GeminiScrollbar);
Vue.use(ElementUI);
Vue.use(iView);
Vue.use(Cookies);
/* 自动设置调试模式 */
window.DEBUG = window.location.hostname === 'localhost'

if (window.DEBUG) {
  //TODO 放置调试环境变量
  //Cookie.set('token', 'ysKOBZ1aJySHcUrxg9SUXO+G9/h1SemBAaCntWCTMcLoZXwSocurvBDtjWSAtf2d0/eILrpPh/YEmeqAw0kLDRV3b87G8fZnmrVG5iiZQEXupTUWl11cLwEHJpXcYpA0iKPE/gMubRSzYjPRnkZ3qTEqMKlwWdn5MUEnlEyNtU8/XyBmk5kz4/MeWN0yhwYWKBRROUIyzVLzHLHcgnGQ8NU=')
  console.info("You are running in DEBUG mode")
}
new Vue({
  el: '#app',
  data: {
   
  },
  router,
  template: '<App/>',
  components: {App}
})

