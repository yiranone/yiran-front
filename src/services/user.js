import API from './api'
import {request, METHOD, removeAuthorization} from '../utils/request'

const user = {
  /**
   * 登录服务
   * @param name 账户名
   * @param password 账户密码
   * @returns {Promise<AxiosResponse<T>>}
   */
  login: async (name, password) => {
    return request(API.LOGIN, METHOD.POST, {
      username: name,
      password: password
    })
  },

  /*退出登录*/
  logout: () => {
    localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
    localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
    localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
    localStorage.removeItem(process.env.VUE_APP_USER_KEY)
    removeAuthorization()
  },

  /*获取路由配置*/
  getRoutesConfig: async () => {
    return request(API.ROUTES, METHOD.GET)
  },

  /*=====================================================================
                              菜单管理模块
  ======================================================================*/
  /*删除用户*/
  deleteMenu(params) {
    return request(`${API.MENU_REMOVE_URI}/${params}`, METHOD.GET)
  },

  /*新增、编辑菜单*/
  menuAddOrEditor(params, type) {
    return request(type === '新增'? API.MENU_ADD_URI : API.MENU_EDIT_URI, METHOD.POST, params)
  },

  /*=====================================================================
                                用户管理模块
  ======================================================================*/
  /*删除用户*/
  deleteUser(params) {
    return request(API.USER_REMOVE_URI, METHOD.POST, params)
  },

  /*新增或编辑用户*/
  userAddOrEditor(params, type) {
    return request(type === '新增'? API.USER_ADD_URI : API.USER_EDIT_URI, METHOD.POST, params)
  },

  /*用户重置密码*/
  userResetPwd(params) {
    return request(API.USER_RESETPWD_URI, METHOD.POST, params)
  },

  /*=====================================================================
                                角色管理模块
  ======================================================================*/
  /*删除角色*/
  deleteRole(params) {
    return request(API.ROLE_REMOVE_URI, METHOD.POST, params)
  },

  /*新增或编辑角色*/
  roleAddOrEditor(params, type) {
    return request(type === '新增'? API.ROLE_ADD_URI : API.ROLE_EDIT_URI, METHOD.POST, params)
  },

  /*=====================================================================
                                权限管理模块
  ======================================================================*/
  /*删除权限*/
  deletePerm(params) {
    return request(API.PERM_REMOVE_URI, METHOD.POST, params)
  },

  /*新增或编辑角色*/
  permAddOrEditor(params, type) {
    return request(type === '新增'? API.PERM_ADD_URI : API.PERM_EDIT_URI, METHOD.POST, params)
  },

}

export default user