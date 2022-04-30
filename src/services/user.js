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
                                币-交易模块
  ======================================================================*/
  /*归集全部*/
  gatherAllMoney(params) {
    return request(API.GATHER_ALL_MONEY_URI, METHOD.POST, params)
  },

  /*归集全部*/
  autoCollect(params) {
    return request(API.SET_AUTO_COLLECT_URI, METHOD.POST, params)
  },

  /*刷新内部账户余额状态*/
  refreshInnerStatics(params) {
    return request(API.REFRESH_INNER_STATICS_URI, METHOD.POST, params)
  },

  /*刷新外部账户余额状态*/
  refreshExternalStatics(params) {
    return request(API.REFRESH_EXTERNAL_STATICS_URI, METHOD.POST, params)
  },

  /*txnId刷新交易结果*/
  refreshTransactionByTxnId(params) {
    return request(API.REFRESH_TRANSACTION_BY_TXNID_URI, METHOD.POST, params)
  },

  /*txnId重新发送http通知*/
  resendNoticeByTxnId(params) {
    return request(API.RESEND_NOTICE_BY_TXNID_URI, METHOD.POST, params)
  },

  /*提现-设置密码*/
  resetPassword(params) {
    return request(API.SYS_RESET_PASSWORD_URI, METHOD.POST, params)
  },

  /*提现-申请*/
  withdrawApply(params) {
    return request(API.WITHDRAW_APPLY_URI, METHOD.POST, params)
  },

  /*提现-发送短信*/
  sendSms(params) {
    return request(API.SEND_SMS_URI, METHOD.POST, params)
  },

  /*设置在首页展示*/
  isShowOnHomePage(params) {
    return request(API.SET_SHOW_ON_HOME_PAGE_URI, METHOD.POST, params)
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

  /*=====================================================================
                              兑换码管理模块
  ======================================================================*/
  /*删除兑换码*/
  deleteExchange(params) {
    return request(API.EXCHANGE_REMOVE_URI, METHOD.POST, params)
  },

  /*兑换码导出*/
  exportExchange(params) {
    return request(API.EXCHANGE_EXPORT_URI, METHOD.POST, params)
  },

  /*生产兑换码*/
  generateExchange(params) {
    return request(API.GENERATE_EXPORT_URI, METHOD.POST, params)
  },

  /*生产兑下载*/
  downloadExchange(params) {
    // return request(API.GENERATE_DOWNLOAD_URI, METHOD.GET, params)
    window.open(`${params.fileName}`)
    // window.location.href = `api/${API.GENERATE_DOWNLOAD_URI}?fileName=${params.fileName}&delete=true`
  },
}

export default user
