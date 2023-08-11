import Websocket from '../../utils/websocket'

export default {
  namespaced: true,
  state: {
    user: undefined,
    loginConfig: undefined,
    permissions: null,
    roles: null,
    dictTypes: [],
    channelList: [],
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
    loginConfig: state => {
      if (!state.loginConfig) {
        try {
          const loginConfig = localStorage.getItem(process.env.VUE_APP_LOGIN_CONFIG_KEY)
          state.loginConfig = JSON.parse(loginConfig)
        } catch (e) {
          console.error(e)
        }
      }
      return state.loginConfig
    },
    permissions: state => {
      // if (!state.permissions) {
      //   try {
      //     const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
      //     state.permissions = JSON.parse(permissions)
      //     state.permissions = state.permissions ? state.permissions : []
      //   } catch (e) {
      //     console.error(e)
      //   }
      // }
      return state.permissions
    },
    dictTypes: state => {
      if (!state.dictTypes) {
        try {
          const dictTypes = localStorage.getItem(process.env.VUE_APP_DICT_TYPE_KEY)
          state.dictTypes = JSON.parse(dictTypes)
          state.dictTypes = state.dictTypes ? state.dictTypes : []
        } catch (e) {
          console.error(e)
        }
      }
      return state.dictTypes
    },
    channelList: state => {
      if (!state.channelList) {
        try {
          const channelList = localStorage.getItem(process.env.VUE_APP_CHANNEL_LIST_KEY)
          state.channelList = JSON.parse(channelList)
          state.channelList = state.channelList ? state.channelList : []
        } catch (e) {
          console.error(e)
        }
      }
      return state.channelList
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
    setLoginConfig (state, loginConfig) {
      state.loginConfig = loginConfig
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = loginConfig.icon;
      document.getElementsByTagName('head')[0].appendChild(link);
      localStorage.setItem(process.env.VUE_APP_LOGIN_CONFIG_KEY, JSON.stringify(loginConfig || {}))
    },
    setAvatar (state, avatar) {
      state.user.avatar = avatar
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(state.user || {}))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      // localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions || []))
    },
    setRoles(state, roles) {
      state.roles = roles
      localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles || []))
    },
    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig || {}))
    },
    setDictTypes (state, dictTypes) {
      state.dictTypes = dictTypes
      localStorage.setItem(process.env.VUE_APP_DICT_TYPE_KEY, JSON.stringify(dictTypes || []))
    },
    setChannelList (state, channelList) {
      state.channelList = channelList
      localStorage.setItem(process.env.VUE_APP_CHANNEL_LIST_KEY, JSON.stringify(channelList || []))
    },
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
