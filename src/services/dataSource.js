import API from './api'
import {METHOD, request} from '../utils/request'

const dataSource = {
  /*菜单列表*/
  menuList: async (params) => {
    return request(API.MENU_LIST_URI, METHOD.POST, params)
  },

  /*角色列表*/
  roleList: async (params) => {
    return request(API.ROLE_LIST_URI, METHOD.POST, params)
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
  deptEdit(params, type) {
    return request(type === '新增'? API.DEPT_ADD_URI : API.DEPT_EDIT_URI, METHOD.POST, params)
  },

  /*用户列表*/
  userList: async (params) => {
    return request(API.USER_LIST_URI, METHOD.POST, params)
  },

  /*权限列表*/
  permsList: async (params) => {
    return request(API.PERM_LIST_URI, METHOD.POST, params)
  },

  /*渠道*/
  channelList: async (params) => {
    return request(API.CHANNEL_LIST_URI, METHOD.POST, params)
  },
  channelRemove(params) {
    return request(API.CHANNEL_REMOVE_URI, METHOD.POST, params)
  },
  channelEdit(params, type) {
    return request(type === '新增'? API.CHANNEL_ADD_URI : API.CHANNEL_EDIT_URI, METHOD.POST, params)
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
  memberEdit(params, type) {
    return request(type === '新增'? API.MEMBER_ADD_URI : API.MEMBER_EDIT_URI, METHOD.POST, params)
  },
  memberResetPassword(params, type) {
    return request( API.MEMBER_RESET_PASSWORD_URI, METHOD.POST, params)
  },
}

export default dataSource
