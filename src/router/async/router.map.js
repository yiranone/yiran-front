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
    path: '/menu',
    component: () => import('@/pages/system/menu')
  },
  role: {
    name: '角色管理',
    path: '/role',
    component: () => import('@/pages/system/role')
  },
  user: {
    name: '用户管理',
    path: '/user',
    component: () => import('@/pages/system/user')
  },
  perm: {
    name: '权限管理',
    path: '/perm',
    component: () => import('@/pages/system/perm')
  },
  exchange: {
    name: '兑换码管理',
    path: '/exchange',
    component: () => import('@/pages/exchange')
  },
  /*交易管理*/
  transaction: {
    name: '交易管理',
    icon: 'transaction',
    component: view.blank
  },
  recharge: {
    name: '充值记录',
    path: '/recharge',
    component: () => import('@/pages/transaction/recharge'),
  },
  withdraw: {
    name: '取现记录',
    path: '/withdraw',
    component: () => import('@/pages/transaction/withdraw'),
  },
  userDeposit: {
    name: '用户充值',
    path: '/userDeposit',
    component: () => import('@/pages/transaction/userDeposit'),
  },
  userWithdraw: {
    name: '用户提现',
    path: '/userWithdraw',
    component: () => import('@/pages/transaction/userWithdraw'),
  },
  hashQuery: {
    name: 'hash查询',
    path: '/hashQuery',
    component: () => import('@/pages/transaction/hashQuery'),
  },
  /*账户管理*/
  account: {
    name: '账户管理',
    icon: 'account-book',
    component: view.blank
  },
  inner: {
    name: '内部账户',
    path: '/inner',
    component: () => import('@/pages/account/inner'),
  },
  external: {
    name: '外部账户',
    path: '/external',
    component: () => import('@/pages/account/external'),
  },
}
export default routerMap
