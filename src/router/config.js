
import routerMap from './router.map'
import {parseRoutes} from '@/utils/routerUtil'

import BlankView from '@/layouts/BlankView'

const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView'),
  authUser: () => import('@/pages/system/role/authUser')
}

// 异步路由配置, 没有登录状态添加login路由
const routesConfig = [
  {
    authority: '*',
    path: 'login',
    invisible: true,
    component: () => import('@/pages/login')
  },
  {
      router: 'root',
      children : [{
        name: '分配用户',
        path: 'auth/authUser',
        component: view.authUser,
        meta: {
          invisible: true,
          page: {
            breadcrumb: ['首页', '角色授权', '授权给用户'],
            title: '授权给用户'
          }
        }
      },
        {
          path: 'exception',
          name: '异常页',
          invisible: true,
          meta: {
            icon: 'warning',
          },
          component: view.page,
          children: [
            { router: 'exp403' },
            { router: 'exp500' },
          ]
        },
        // {
        //   name: '使用文档',
        //   path: 'doc',
        //   meta: {
        //     icon: 'file-word',
        //     link: 'https://iczer.gitee.io/vue-antd-admin-docs/'
        //   }
        // },
        // {
        //   name: '首页参数2',
        //   path: 'home2/:id',
        //   meta: {
        //     icon: 'project',
        //     params: {
        //       id: 123
        //     },
        //     query: {
        //       name: '张三'
        //     }
        //   },
        //   component: () => import('@/pages/home')
        // },
        // {
        //   name: '首页参数3',
        //   path: 'home2/:id',
        //   meta: {
        //     icon: 'project',
        //     params: {
        //       id: 456
        //     },
        //     query: {
        //       name: '张三'
        //     }
        //   },
        //   component: () => import('@/pages/home')
        // },
        // {
        //   name: '首页参数4',
        //   path: 'home3',
        //   meta: {
        //     icon: 'project',
        //     query: {
        //       name: '里斯'
        //     }
        //   },
        //   component: () => import('@/pages/home')
        // },
        {
        invisible: true,
        name: '我的',
        path: 'person',
        component: view.blank,
        children : [
          {
            router: 'personCenter'
          },
          {
            router: 'personSetting'
          },
        ]
      },{
        router: 'home'
      },

      ],
  },
  // 'root',
  {
    router: 'exp404',
    path: '/404',
    name: '404',
    invisible: true,
    component: () => import('@/pages/exception/404')
  },
  {
    router: 'exp403',
    name: 'exp403',
    path: '403',
    invisible: true,
    component: () => import('@/pages/exception/403')
  },
  {
    name: 'exp500',
    path: '500',
    invisible: true,
    component: () => import('@/pages/exception/500')
  }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
