import Vue from 'vue'
import VueRouter from 'vue-router'
import {formatRoutes} from '@/utils/routerUtil'

Vue.use(VueRouter)

// 不需要登录拦截的路由配置
const loginIgnore = {
  names: ['404', '403'],      //根据路由名称匹配
  paths: ['/login','/captcha/get'],   //根据路由fullPath匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path)
  }
}

const authUrl = {
  paths: ['/login','/captcha/get','/captcha/check'],
  needLogin(url) { //这些url不需要登录授权
    const p = this.paths.find(e=>{
      if(e.endsWith(url))
        return e
    })
    return p != null
  }
}

/**
 * 初始化路由实例
 * @returns {VueRouter}
 */
function initRouter() {
  const options = require('./config').default
  formatRoutes(options.routes)
  // console.info("默认的options:" + JSON.stringify(options))
  return new VueRouter(options)
}

const router = initRouter();

export {loginIgnore, authUrl, router, initRouter}
