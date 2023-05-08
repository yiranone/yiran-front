// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  root: {
    path: '/',
    name: '当前位置',
    redirect: '/home',
    invisible: true,
    component: view.tabs
  },
  personCenter :{
    name: '个人中心',
    path: 'center',
    invisible: true,
    component: () => import('@/pages/person/center')
  },
  personSetting :{
    authority: '*',
    name: '个人设置',
    path: 'setting',
    invisible: true,
    component: () => import('@/pages/person/setting')
  },
  home: {
    name: '首页',
    path: 'home',
    icon: 'home',
    component: () => import('@/pages/home')
  },
//   login: {
//     authority: '*',
//     path: 'login',
//     invisible: true,
//     component: () => import('@/pages/login')
//   },
  exp403: {
    authority: '*',
    name: '没有权限访问',
    path: '403',
    invisible: true,
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: '页面没找到',
    path: '404',
    invisible: true,
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: '服务器异常',
    path: '500',
    invisible: true,
    component: () => import('@/pages/exception/500')
  },
// /*  person: {
//     authority: '*',
//     path: '/person',
//     component: view.blank
//   },*/
//   percenter: {
//     authority: '*',
//     name: '个人中心',
//     path: 'percenter',
//     invisible: true, //这个导航在菜单不可见
//     component: () => import('@/pages/personCenter')
//   },

  // home: {
  //   name: '首页',
  //   path: 'home',
  //   icon: 'home',
  //   component: () => import('@/pages/home')
  // },

  /*系统管理*/
/*  system2: {
    name: '系统管理2',
    icon: 'setting',
    component: view.blank
  },*/
/*  system: {
    name: '系统管理',
    icon: 'setting',
    component: view.blank
  },
  menu: {
    name: '菜单管理',
    path: 'menu', //相对路径，url会自动加上父菜单的路径
    component: () => import('@/pages/system/menu')
  },
  role: {
    name: '角色管理',
    path: 'role',
    component: () => import('@/pages/system/role')
  },
  dept: {
    name: '部门管理',
    path: 'dept',
    component: () => import('@/pages/system/dept')
  },
  online: {
    name: '在线用户',
    path: 'online',
    component: () => import('@/pages/system/online')
  },
  config: {
    name: '系统参数',
    path: 'config',
    component: () => import('@/pages/system/config')
  },
  operateLog: {
    name: '操作日志',
    path: 'operateLog',
    component: () => import('@/pages/system/operateLog')
  },
  dict: {
    name: '数据字典',
    path: 'dict',
    component: () => import('@/pages/system/dict')
  },
  user: {
    name: '用户管理',
    path: 'user',
    component: () => import('@/pages/system/user')
  },
  perm: {
    name: '权限管理',
    path: 'perm',
    component: () => import('@/pages/system/perm')
  },
  channel: {
    name: '渠道管理',
    path: 'channel',
    component: () => import('@/pages/system/channel')
  },
  // member: {
  //   name: '会员管理',
  //   path: 'member',
  //   component: () => import('@/pages/system/member')
  // }
 */
}
export default routerMap
