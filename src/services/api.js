module.exports = {
  LOGIN: 'login', // 登录
  ROUTES: 'menu', // 获取路由配置
  INNER_ACCOUNT_BLANCE_LIST_URI: 'ext/trans/queryInnerStatics', // 内部账户余额列表
  EXTERNAL_ACCOUNT_BLANCE_LIST_URI: 'ext/trans/queryExternalStatics', // 外部账户余额列表
  REFRESH_TRANSACTION_BY_TXNID_URI: 'ext/trans/refreshTransactionByTxnId', // txnId刷新交易结果
  RESEND_NOTICE_BY_TXNID_URI: 'ext/http/notice/resend', // txnId重新发送http通知
  REFRESH_TRANSACTION_BY_TXNHASH_URI: 'ext/trans/refreshTransactionByTxnHash', // txnHash查询
  /*===币交易===*/
  DEPOSIT_LIST_URI: 'ext/deposit/list', // 存入列表
  WITHDRAW_LIST_URI: 'ext/withdraw/list', // 取现列表
  SYS_RESET_PASSWORD_URI: 'system/user/profile/resetAssertPwd', // 提现-设置密码
  SEND_SMS_URI: 'system/user/sendSms', // 提现-发送短信
  WITHDRAW_APPLY_URI: 'ext/withdraw/apply', // 提现-申请
  SYS_ADDRESS_LIST_URI: 'ext/withdraw/config/list', // 提现-提币地址列表
  GATHER_ALL_MONEY_URI: 'ext/trans/gatherAllMoney', // 归集全部
  SET_AUTO_COLLECT_URI: 'ext/trans/setAutoCollect', // 归集-是否自动
  REFRESH_INNER_STATICS_URI: 'ext/trans/refreshInnerStatics', // 刷新内部账户余额状态
  REFRESH_EXTERNAL_STATICS_URI: 'ext/trans/refreshAddressBalance', // 刷新外部账户余额状态
  WITHDRAW_NOTICE_URI: 'message/notice', // 提现状态通知
  SET_SHOW_ON_HOME_PAGE_URI: 'ext/trans/setShowOnHomePage', // 设置在首页展示
  /*===菜单管理===*/
  MENU_LIST_URI: 'system/menu/list', // 菜单列表
  MENU_REMOVE_URI: 'system/menu/remove', // 用户删除
  MENU_ADD_URI: 'system/menu/add', // 新增菜单
  MENU_EDIT_URI: 'system/menu/edit', // 编辑菜单
  /*===用户管理===*/
  USER_LIST_URI: 'system/user/list', // 用户列表
  USER_REMOVE_URI: 'system/user/remove', // 用户删除
  USER_ADD_URI: 'system/user/add', // 用户新增
  USER_EDIT_URI: 'system/user/edit', // 用户编辑
  USER_RESETPWD_URI: 'system/user/resetPwd', // 用户重置密码
  /*===角色管理===*/
  ROLE_LIST_URI: 'system/role/list', // 角色列表
  ROLE_REMOVE_URI: 'system/role/remove', // 用户删除
  ROLE_ADD_URI: 'system/role/add', // 角色新增
  ROLE_EDIT_URI: 'system/role/edit', // 角色编辑
  /*===权限管理===*/
  PERM_LIST_URI: 'system/perm/list', // 权限列表
  PERM_REMOVE_URI: 'system/perm/remove', // 权限删除
  PERM_ADD_URI: 'system/perm/add', // 权限新增
  PERM_EDIT_URI: 'system/perm/edit', // 权限编辑
  /*===兑换码管理===*/
  EXCHANGE_LIST_URI: 'ext/exchange/list', // 兑换码列表
  EXCHANGE_REMOVE_URI: 'ext/exchange/delete', // 兑换码删除
  EXCHANGE_EXPORT_URI: 'ext/exchange/export', // 兑换码导出
  GENERATE_EXPORT_URI: 'ext/exchange/generate', // 生产兑换码
  GENERATE_DOWNLOAD_URI: 'profile/export', // 生产兑下载
}
