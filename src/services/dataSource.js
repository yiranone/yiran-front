import API from './api'
import {METHOD, request} from '../utils/request'

const dataSource = {
  /*菜单列表*/
  menuList: async (params) => {
    return request(API.MENU_LIST_URI, METHOD.POST, params)
  },
  menuDelete(params) {
    return request(API.MENU_REMOVE_URI,METHOD.POST, params)
  },
  menuAdd(params) {
    return request( API.MENU_ADD_URI, METHOD.POST, params)
  },
  menuEdit(params) {
    return request(API.MENU_EDIT_URI, METHOD.POST, params)
  },
  menuDetail: async (params) => {
    return request(API.MENU_DETAIL_URI, METHOD.POST, params)
  },

  /*新增或编辑角色*/
  permDelete(params) {
    return request(API.PERM_REMOVE_URI, METHOD.POST, params)
  },
  permAdd(params) {
    return request(API.PERM_ADD_URI , METHOD.POST, params)
  },
  permEdit(params) {
    return request( API.PERM_EDIT_URI, METHOD.POST, params)
  },

  /** 角色列表*/
  roleDetail: async (params) => {
    return request(API.ROLE_DETAIL_URI, METHOD.POST, params)
  },
  roleList: async (params) => {
    return request(API.ROLE_LIST_URI, METHOD.POST, params)
  },
  roleRemove(params) {
    return request(API.ROLE_REMOVE_URI, METHOD.POST, params)
  },
  roleAdd(params) {
    return request(API.ROLE_ADD_URI , METHOD.POST,params)
  },
  roleEdit(params) {
    return request(API.ROLE_EDIT_URI, METHOD.POST, params)
  },
  roleAllocatedUser(params) {
    return request(API.ROLE_ALLOCATED_USER_URI, METHOD.POST, params)
  },
  roleUnAllocatedUser(params) {
    return request(API.ROLE_UNALLOCATED_USER_URI, METHOD.POST, params)
  },
  roleAuthUser(params) {
    return request(API.ROLE_AUTH_USER_URI, METHOD.POST, params)
  },
  roleUnAuthUser(params) {
    return request(API.ROLE_UNAUTH_USER_URI, METHOD.POST, params)
  },

  /** 操作日志 */
  operateLogDetail: async (params) => {
    return request(API.OPERATE_LOG_DETAIL_URI, METHOD.POST, params)
  },
  operateLogList: async (params) => {
    return request(API.OPERATE_LOG_LIST_URI, METHOD.POST, params)
  },
  operateLogRemove(params) {
    return request(API.OPERATE_LOG_REMOVE_URI, METHOD.POST, params)
  },
  operateLogClean(params) {
    return request(API.OPERATE_LOG_CLEAN_URI, METHOD.POST, params)
  },
  /**在线用户 */
  onlineDetail: async (params) => {
    return request(API.ONLINE_DETAIL_URI, METHOD.POST, params)
  },
  onlineList: async (params) => {
    return request(API.ONLINE_LIST_URI, METHOD.POST, params)
  },
  onlineLogout(params) {
    return request(API.ONLINE_LOGOUT_URI, METHOD.POST, params)
  },
  /** 配置 */
  configDetail: async (params) => {
    return request(API.CONFIG_DETAIL_URI, METHOD.POST, params)
  },
  configList: async (params) => {
    return request(API.CONFIG_LIST_URI, METHOD.POST, params)
  },
  configRemove(params) {
    return request(API.CONFIG_REMOVE_URI, METHOD.POST, params)
  },
  configEdit(params) {
    return request(API.CONFIG_EDIT_URI, METHOD.POST, params)
  },
  configAdd(params) {
    return request(API.CONFIG_ADD_URI , METHOD.POST, params)
  },
  /** 通知 */
  noticeDetail: async (params) => {
    return request(API.NOTICE_DETAIL_URI, METHOD.POST, params)
  },
  noticeList: async (params) => {
    return request(API.NOTICE_LIST_URI, METHOD.POST, params)
  },
  noticeRemove(params) {
    return request(API.NOTICE_REMOVE_URI, METHOD.POST, params)
  },
  noticeEdit(params) {
    return request(API.NOTICE_EDIT_URI, METHOD.POST, params)
  },
  noticeAdd(params) {
    return request(API.NOTICE_ADD_URI , METHOD.POST, params)
  },
  /*数据字典*/
  dictDetail: async (params) => {
    return request(API.DICT_DETAIL_URI, METHOD.POST, params)
  },
  dictList: async (params) => {
    return request(API.DICT_LIST_URI, METHOD.POST, params)
  },
  dictRemove(params) {
    return request(API.DICT_REMOVE_URI, METHOD.POST, params)
  },
  dictEdit(params) {
    return request(API.DICT_EDIT_URI, METHOD.POST, params)
  },
  dictAdd(params) {
    return request(API.DICT_ADD_URI , METHOD.POST, params)
  },
  dictDataDetail: async (params) => {
    return request(API.DICT_DATA_DETAIL_URI, METHOD.POST, params)
  },
  dictDataList: async (params) => {
    return request(API.DICT_DATA_LIST_URI, METHOD.POST, params)
  },
  dictDataDelete(params) {
    return request(API.DICT_DATA_DELETE_URI, METHOD.POST, params)
  },
  dictDataEdit(params) {
    return request( API.DICT_DATA_EDIT_URI, METHOD.POST, params)
  },
  dictDataAdd(params) {
    return request( API.DICT_DATA_ADD_URI , METHOD.POST, params)
  },

  /*部门管理*/
  deptList: async (params) => {
    return request(API.DEPT_LIST_URI, METHOD.POST, params)
  },
  deptRemove(params) {
    return request(API.DEPT_REMOVE_URI, METHOD.POST, params)
  },
  deptAdd(params) {
    return request(API.DEPT_ADD_URI , METHOD.POST, params)
  },
  deptEdit(params) {
    return request(API.DEPT_EDIT_URI, METHOD.POST, params)
  },

  /*用户列表*/
  userList: async (params) => {
    return request(API.USER_LIST_URI, METHOD.POST, params)
  },
  /*查询用户*/
  userDetail(params) {
    return request(API.USER_DETAIL_URI, METHOD.POST, params)
  },
  userDelete(params) {
    return request(API.USER_DELETE_URI, METHOD.POST, params)
  },
  userAdd(params) {
    return request( API.USER_ADD_URI , METHOD.POST, params)
  },
  userEdit(params) {
    return request(API.USER_EDIT_URI, METHOD.POST, params)
  },
  userUnlock(params) {
    return request(API.USER_UNLOCK_URI, METHOD.POST, params)
  },
  /*用户重置密码*/
  userResetPwd(params) {
    return request(API.USER_RESETPWD_URI, METHOD.POST, params)
  },

  /*权限列表*/
  permsList: async (params) => {
    return request(API.PERM_LIST_URI, METHOD.POST, params)
  },

  /*渠道*/
  channelDetail: async (params) => {
    return request(API.CHANNEL_DETAIL_URI, METHOD.POST, params)
  },
  channelList: async (params) => {
    return request(API.CHANNEL_LIST_URI, METHOD.POST, params)
  },
  channelRemove(params) {
    return request(API.CHANNEL_REMOVE_URI, METHOD.POST, params)
  },
  channelEdit(params ) {
    return request( API.CHANNEL_EDIT_URI, METHOD.POST, params)
  },
  channelAdd(params) {
    return request(API.CHANNEL_ADD_URI , METHOD.POST, params)
  },

  /*会员管理*/
  memberDetail: async (params) => {
    return request(API.MEMBER_DETAIL_URI, METHOD.POST, params)
  },
  memberList: async (params) => {
    return request(API.MEMBER_LIST_URI, METHOD.POST, params)
  },
  memberRemove(params) {
    return request(API.MEMBER_REMOVE_URI, METHOD.POST, params)
  },
  memberEdit(params) {
    return request(API.MEMBER_EDIT_URI, METHOD.POST, params)
  },
  memberAdd(params) {
    return request( API.MEMBER_ADD_URI , METHOD.POST, params)
  },
  memberResetPassword(params) {
    return request( API.MEMBER_RESET_PASSWORD_URI, METHOD.POST, params)
  },
}

export default dataSource
