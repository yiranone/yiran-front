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

  /*用户列表*/
  userList: async (params) => {
    return request(API.USER_LIST_URI, METHOD.POST, params)
  },

  /*权限列表*/
  permsList: async (params) => {
    return request(API.PERM_LIST_URI, METHOD.POST, params)
  },

  /*渠道列表*/
  channelList: async (params) => {
    return request(API.CHANNEL_LIST_URI, METHOD.POST, params)
  },
  /*删除权限*/
  channelRemove(params) {
    return request(API.CHANNEL_REMOVE_URI, METHOD.POST, params)
  },
  /*新增或编辑角色*/
  channelEdit(params, type) {
    return request(type === '新增'? API.CHANNEL_ADD_URI : API.CHANNEL_EDIT_URI, METHOD.POST, params)
  },
}

export default dataSource
