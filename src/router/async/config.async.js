import routerMap from './router.map'
import {parseRoutes} from '../../utils/routerUtil'

// 异步路由配置, 没有登陆状态添加login路由
const routesConfig = [
  'login',
  // 'root',
  // {
  //   path:"/home",
  //   name:"首页",
  //   router: "home"
  // },
  // {
  //   router: 'exp404',
  //   path: '/404',
  //   name: '404'
  // },
  // {
  //   router: 'exp403',
  //   path: '/403',
  //   name: '403'
  // }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
