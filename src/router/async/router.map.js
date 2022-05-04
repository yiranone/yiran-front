// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },
/*  person: {
    authority: '*',
    path: '/person',
    component: view.blank
  },*/
  percenter: {
    authority: '*',
    name: '个人中心',
    path: '/percenter',
    invisible: true,
    component: () => import('@/pages/personCenter')
  },
  root: {
    path: '/',
    name: '当前位置',
    redirect: '/home',
    component: view.tabs
  },
  home: {
    name: '首页',
    path: '/home',
    icon: 'home',
    component: () => import('@/pages/home')
  },
  /*系统管理*/
  system: {
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
  user: {
    name: '用户管理',
    path: 'user',
    component: () => import('@/pages/system/user')
  },
  perm: {
    name: '权限管理',
    path: 'perm',
    component: () => import('@/pages/system/perm')
  }
}
export default routerMap
