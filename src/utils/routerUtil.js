import routerMap from '../router/router.map'
import {mergeI18nFromRoutes} from '@/utils/i18n'
import Router from 'vue-router'
import deepMerge from 'deepmerge'
import {userSource as us, metadataSource, metadataSource as ms} from "../services";
import {checkAuthorization, randomTest} from "./request";
import options from "@/router/config";
import {initRouter, router} from "@/router";
import {generateString} from "@/utils/stringUtil";


// const loadView = (view) => {
//   if(view.startsWith("/")) {
//     view = view.toString().substring(1)
//   }
//   return (resolve) => require([`@/${view}`], resolve)
// }

// const loadView = (view) => {
//   let str=view.toString().substring(1Ï)
//   console.info("str:"+str)
//   return (resolve) => require([`../${str}`], resolve)
// }

function resetRouter (r) {
  const newRouter = initRouter()
  // console.info("用户重置=="+ JSON.stringify(newRouter.options))
  // r = newRouter
  r.options = newRouter.options
  r.matcher = newRouter.matcher
  // console.info("用户退出登录，重置路由为:" + JSON.stringify(newRouter.options))
}

function parseRoutes(routesConfig, routerMap) {
  let routes = []
  for (let i = 0; i < routesConfig.length; i++) {
    const item = routesConfig[i]
    // 获取注册在 routerMap 中的 router，初始化 routeCfg
    //console.info("菜单处理:"+JSON.stringify(item))
    let router = undefined, routeCfg = {}
    if (typeof item === 'string' && routerMap[item]) {
      router = routerMap[item]
      routeCfg = {path: router.path || item, router: item}
    } else if (typeof item === 'object') {
      router = routerMap[item.router]
      routeCfg = item
    }

    if (!router) {
      //console.warn(`can't find register for router ${routeCfg.router}, please register it in advance.`)
      router = typeof item === 'string' ? {path: item, name: item} : item
    }

    // 从 router 和 routeCfg 解析路由
    const meta = {
      authority: router.authority,
      icon: router.icon,
      page: router.page,
      link: router.link,
      params: router.params,
      query: router.query,
      ...router.meta
    }
    const cfgMeta = {
      authority: routeCfg.authority,
      icon: routeCfg.icon,
      page: routeCfg.page,
      link: routeCfg.link,
      params: routeCfg.params,
      query: routeCfg.query,
      ...routeCfg.meta
    }
    Object.keys(cfgMeta).forEach(key => {
      if (cfgMeta[key] === undefined || cfgMeta[key] === null || cfgMeta[key] === '') {
        delete cfgMeta[key]
      }
    })
    Object.assign(meta, cfgMeta)
    const route = {
      path: routeCfg.path || router.path || routeCfg.router,
      name: routeCfg.name || router.name,
      component: router.component,
      redirect: routeCfg.redirect || router.redirect,
      meta: {...meta, authority: meta.authority || '*'}
    }
    if (routeCfg.invisible || router.invisible) {
      route.meta.invisible = true
    }
    if(routeCfg.component && routeCfg.component.length > 0) {
      //console.info("注册组件"+ routeCfg.component)
      let view = routeCfg.component.toString();
      if(view.startsWith("/")) {
        view = view.substring(1)
      }
      route.component = () => import(`@/${view}`)
      // route.component = loadView(`${routeCfg.component}`)
    }

    if (item.menuType == 'M') { //如果是目录，给空的视图
      route.component = () => import('@/layouts/BlankView')
    }
    if (routeCfg.invisible || router.invisible || (routeCfg.meta && routeCfg.meta.invisible)) {
      route.meta.invisible = true
    }
    if (routeCfg.children && routeCfg.children.length > 0) {
      route.children = parseRoutes(routeCfg.children, routerMap)
    }
    if(route.path == null && route.meta && route.meta.link) {
      // const randomString = generateString (11)
      // console.info("链接route，自动给一个path=",randomString)
      // route.path = randomString;
    }
    if(route.path == null) {
      console.info("菜单name=[" + route.name + "]的path没有设置，不显示")
    } else {
      console.info("菜单增加路由:" + JSON.stringify(route))
      routes.push(route)
    }
  }
  return routes
}

/**
 * 加载服务器路由
 * @param router 应用路由实例
 * @param store 应用的 vuex.store 实例
 * @param i18n 应用的 vue-i18n 实例
 * @param routesConfig 路由配置
 */
async function loadRoutes({router, store, i18n}) {
  // 如果 serverRoutesConfig 有值，则更新到本地，否则从本地获取
  let serverRoutesConfig = null
  if (checkAuthorization()) {
    console.info("loadRoutes")
    await us.getRoutesConfig().then(res => {
      console.info("loadRoutes success")
      serverRoutesConfig =[{
        router: 'root',
        children: [...res]
      }]
    })

    // routesConfig =[{
    //       router: 'root',
    //       children: [{
    //         router: 'percenter'
    //       }, ...router.options.routes]
    //     }]
    // console.info("后台应答目录:" + JSON.stringify(serverRoutesConfig))
  }
  // 如果开启了异步路由，则加载异步路由配置
  let finalRoutes = router.options.routes
  const asyncRoutes = store.state.setting.asyncRoutes
  if (asyncRoutes) {
    if (serverRoutesConfig && serverRoutesConfig.length > 0) {
      let serverRoutes = parseRoutes(serverRoutesConfig, routerMap)
      //filterNoChildFolder(serverRoutes)
      formatRoutes(serverRoutes)
      finalRoutes = deepMergeRoutes([], serverRoutes)
      router.options.routes = [...router.options.routes, ...finalRoutes]
      // router.matcher = new Router({...router.options, routes:[]}).matcher
      router.addRoutes(finalRoutes.filter(e => !!e.path))
    }
  }
  // 提取路由国际化数据
  mergeI18nFromRoutes(i18n, router.options.routes)
  // 初始化Admin后台菜单数据
  const rootRoute = finalRoutes.find(item => item.path === '/')
  const menuRoutes = rootRoute && rootRoute.children
  if (menuRoutes) {
    const formatMenu = routesList => {
      return Object.values(routesList).map(item => {
        let menu = {}
        //菜单有这几个属性就可以了
        menu.name = item.name
        if(item.path)
          menu.path = item.path
        if (item.meta) {
          menu.meta={}
          menu.meta.invisible = item.meta.invisible
          menu.meta.icon = item.meta.icon
          menu.meta.link = item.meta.link
          menu.meta.params = item.meta.params
          menu.meta.query = item.meta.query
        }
        if (item.children) {
          menu.children = formatMenu(item.children)
        }
        return menu
      })
    }
    let menus = formatMenu(menuRoutes)
    store.commit('setting/setMenuData', menus)
    return menus
  }
}

function loadLoginConfig(router, store, i18n) {
  if (checkAuthorization()) {
    us.loginConfig().then(data => {
      console.info("加载登录配置，后台应答:" + JSON.stringify(data))
      store.commit('account/setLoginConfig', data)
    })
  }
}

function loadUser(router, store, i18n) {
  if (checkAuthorization()) {
    us.getProfile().then(data => {
      console.info("当前登录用户，后台应答profile:" + JSON.stringify(data))
      store.commit('account/setUser', data)
    })
  }
}

async function loadPermissions(router, store, i18n) {
  if (checkAuthorization()) {
     await us.getCurrentPerms().then(data => {
       console.info("当前登录用户，后台应答权限:" + JSON.stringify(data))
       store.commit('account/setPermissions', data)
    })
  }
}

async function loadAllDictTypes(router, store, i18n) {
  if (checkAuthorization()) {
    await metadataSource.dictAll().then(data => {
      console.info("后台返回数据字典:" + JSON.stringify(data))
      store.commit('account/setDictTypes', data)
    })
    await metadataSource.channelAll().then(data => {
      console.info("后台返回渠道字典:" + JSON.stringify(data))
      store.commit('account/setChannelList', data)
    })
  }
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
  const routesMap = {}
  target.forEach(item => routesMap[item.path] = item)
  source.forEach(item => routesMap[item.path] = item)
  return Object.values(routesMap)
}

/**
 * 深度合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function deepMergeRoutes(target, source) {
  // 映射路由数组
  const mapRoutes = routes => {
    const routesMap = {}
    routes.forEach(item => {
      routesMap[item.path] = {
        ...item,
        children: item.children ? mapRoutes(item.children) : undefined
      }
    })
    return routesMap
  }
  const tarMap = mapRoutes(target)
  const srcMap = mapRoutes(source)

  // 合并路由
  const merge = deepMerge(tarMap, srcMap)

  // 转换为 routes 数组
  const parseRoutesMap = routesMap => {
    return Object.values(routesMap).map(item => {
      if (item.children) {
        item.children = parseRoutesMap(item.children)
      } else {
        delete item.children
      }
      return item
    })
  }
  return parseRoutesMap(merge)
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes(routes) {
  routes.forEach(route => {
    const {path} = route
    if (!path.startsWith('/') && path !== '*') {
      route.path = '/' + path
    }
  })
  //formatAuthority(routes)
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority(routes, pAuthorities = []) {
  routes.forEach(route => {
    const meta = route.meta
    const defaultAuthority = pAuthorities[pAuthorities.length - 1] || {permission: '*'}
    if (meta) {
      let authority = {}
      if (!meta.authority) {
        authority = defaultAuthority
      }else if (typeof meta.authority === 'string') {
        authority.permission = meta.authority
      } else if (typeof meta.authority === 'object') {
        authority = meta.authority
        const {role} = authority
        if (typeof role === 'string') {
          authority.role = [role]
        }
        if (!authority.permission && !authority.role) {
          authority = defaultAuthority
        }
      }
      meta.authority = authority
    } else {
      const authority = defaultAuthority
      route.meta = {authority}
    }
    route.meta.pAuthorities = pAuthorities
    if (route.children) {
      formatAuthority(route.children, [...pAuthorities, route.meta.authority])
    }
  })
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
  const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
  keys.push('name')
  return keys.join('.')
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
  const {beforeEach, afterEach} = guards
  const {router} = options
  beforeEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.beforeEach((to, from, next) => guard(to, from, next, options))
    }
  })
  afterEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.afterEach((to, from) => guard(to, from, options))
    }
  })
}

export {parseRoutes, resetRouter, loadRoutes, getI18nKey, loadGuards, loadLoginConfig, loadUser,loadPermissions, loadAllDictTypes,deepMergeRoutes, formatRoutes}
