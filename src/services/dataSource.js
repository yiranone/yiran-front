import API from './api'
import {METHOD, request} from '../utils/request'

const dataSource = {
  /*内部账户余额列表*/
  innerAccountBlanceList: async (params) => {
    return request(API.INNER_ACCOUNT_BLANCE_LIST_URI, METHOD.POST, params)
  },

  /*外部账户余额列表*/
  externalAccountBlanceList: async (params) => {
    return request(API.EXTERNAL_ACCOUNT_BLANCE_LIST_URI, METHOD.POST, params)
  },

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

  /*存款列表*/
  depositList: async (params) => {
    return request(API.DEPOSIT_LIST_URI, METHOD.POST, params)
  },

  /*提现列表*/
  withdrawList: async (params) => {
    return request(API.WITHDRAW_LIST_URI, METHOD.POST, params)
  },

  /*txnHash查询*/
  queryTransactionByTxnHash(params) {
    return request(API.REFRESH_TRANSACTION_BY_TXNHASH_URI, METHOD.POST, params)
  },

  /*提现-提币地址列表*/
  sysAddressList: async (params) => {
    return request(API.SYS_ADDRESS_LIST_URI, METHOD.POST, params)
  },

  /*兑换码列表*/
  exchangeList: async (params) => {
    return request(API.EXCHANGE_LIST_URI, METHOD.POST, params)
  }
}

export default dataSource
