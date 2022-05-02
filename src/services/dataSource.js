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
  }
}

export default dataSource
