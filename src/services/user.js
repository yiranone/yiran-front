import API from './api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

const user = {
  loginConfig: async () => {
    return request(API.LOGIN_CONFIG, METHOD.POST, {
    })
  },
  /**
   * 登录服务
   */
  login: async (name, password,captchaVerification) => {
    return request(API.LOGIN, METHOD.POST, {
      username: name,
      password: password,
      captchaVerification: captchaVerification
    })
  },

  /*退出登录*/
  logout: () => {
    request(API.LOGOUT, METHOD.POST).then(r => {
      console.info("退出登录应答:" + r)
      localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
      localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
      localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
      localStorage.removeItem(process.env.VUE_APP_USER_KEY)
      removeAuthorization()
    }).catch(err => {
      console.info("退出登录异常应答:" + err)
    })
  },

  /*获取路由配置*/
  getRoutesConfig: async () => {
    return request(API.ROUTES, METHOD.GET)
  },
  /*获取当前等用户的权限列表*/
  getCurrentPerms: async (params) => {
    return request(API.CURRENT_PERMS, METHOD.POST,params)
  },
  getProfile: async (params) => {
    return request(API.PROFILE_MY, METHOD.POST,params)
  },
  checkPassword: async (params) => {
    return request(API.PROFILE_CHECK_PASSWORD, METHOD.POST,params)
  },
  modifyPassword: async (params) => {
    return request(API.PROFILE_MODIFY_PASSWORD, METHOD.POST,params)
  },
  updateProfile: async (params) => {
    return request(API.PROFILE_UPDATE, METHOD.POST,params)
  },
  updateAvatar: async (params) => {
    return request(API.PROFILE_UPDATE_AVATAR, METHOD.POST,params)
  },

}

export default user