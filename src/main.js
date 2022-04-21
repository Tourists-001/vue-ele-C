import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './config/rem'
// Vue.config.productionTip = false
// 注册全局组件
import headTop from './components/header/head.vue'
Vue.component(headTop.name, headTop)
// swiper 组件的样式
import 'swiper/css/swiper.css'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')