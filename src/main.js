import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入vant组件(全部组件)
import Vant from 'vant'
import 'vant/lib/index.css'

// 加载全局样式
import '@/styles/index.less'

// 加载动态设置REM的基准值
import 'amfe-flexible'

//引入时间处理工具
import '@/utils/dayjs'


Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
