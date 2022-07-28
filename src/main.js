import Vue from 'vue'
import App from './App.vue'
import {router} from '@/router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import Viser from 'viser-vue'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import "@/plugins/svg-icon-plugin";
import 'moment/locale/zh-cn'
import aLink from '@/components/a-link'
import permission from '@/directive/permission'
import {TableSetting } from '@/components'
import {parseTime, selectDictLabel, selectDictLabels} from '@/utils/dict-utils'
import { download } from '@/utils/request'

// const router = initRouter()
console.info("main.js前端初始化目录,未加载后台目录之前:" + JSON.stringify(router.options.routes))

const i18n = initI18n('CN', 'US')

Vue.prototype.parseTime=parseTime
Vue.prototype.selectDictLabel=selectDictLabel
Vue.prototype.selectDictLabels=selectDictLabels
Vue.prototype.download = download

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(aLink)
Vue.use(permission)

Vue.component('table-setting', TableSetting)

bootstrap({router, store, i18n, message: Vue.prototype.$message})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')