import Websocket from '../../utils/websocket'
import {WITHDRAW_NOTICE_URI} from '../../services/api'

export default {
  namespaced: true,
  state: {
    user: undefined,
    permissions: null,
    roles: null,
    routesConfig: null,
    innerAccountList: [],
    // websocket: new Websocket()
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = localStorage.getItem(process.env.VUE_APP_ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e)
        }
      }
      return state.roles
    },
    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
          state.routesConfig = JSON.parse(routesConfig)
          state.routesConfig = state.routesConfig ? state.routesConfig : []
        } catch (e) {
          console.error(e)
        }
      }
      return state.routesConfig
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user || {}))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions || []))
    },
    setRoles(state, roles) {
      state.roles = roles
      localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles || []))
    },
    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig || {}))
    },
    setInnerAccountList(state, innerAccountList) {
      state.innerAccountList = innerAccountList
    }
  },
  actions: {
    // getWebsocketInfo({state}) {
    //   state.websocket.createWebSocket({
    //     url: WITHDRAW_NOTICE_URI,
    //     onmessage: (res) => {
    //       console.log(res)
    //       for (let i = 0; i < state.innerAccountList.length; i++) {
    //         if (state.innerAccountList[i].balanceId == res.data.balanceId) {
    //           state.innerAccountList[i] = {...state.innerAccountList[i], ...res.data}
    //           break
    //         }
    //       }
    //       state.innerAccountList = [...state.innerAccountList]
    //     }
    //   })
    // },
    //
    // closeWebsocket({state}) {
    //   if (!state.websocket.websock) return;
    //   state.websocket.websock.close()
    // }
  }
}
