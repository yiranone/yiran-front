import Vue from 'vue'
import App from './App.vue'
import {router} from '@/router'
import 'ant-design-vue/dist/antd.less';
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import "@/plugins/svg-icon-plugin";
import aLink from '@/components/a-link'

import './core/init' //加载一些组件

console.info("main.js前端初始化目录,未加载后台目录之前:" + JSON.stringify(router.options.routes))

const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(aLink)

//加载后台 用户，菜单，权限等等
bootstrap({router, store, i18n, message: Vue.prototype.$message})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')