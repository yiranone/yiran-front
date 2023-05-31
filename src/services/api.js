module.exports = {
  LOGIN_CONFIG: 'login/config', // 登录配置，是否要验证码
  LOGIN: 'login', // 登录
  LOGOUT: 'logout', // 退出
  ROUTES: 'menu', // 获取当前登录用户的路由配置（菜单）
  CURRENT_PERMS: 'auth/current/perms', // 获取当前登录用户的权限
  PROFILE_MY: 'system/user/profile/my',
  PROFILE_CHECK_PASSWORD: 'system/user/profile/checkPassword',
  PROFILE_MODIFY_PASSWORD: 'system/user/profile/modifyPwd',
  PROFILE_RESET_PASSWORD: 'system/user/profile/resetAssertPwd',
  PROFILE_UPDATE: 'system/user/profile/update',
  PROFILE_UPDATE_AVATAR: 'system/user/profile/updateAvatar',

  HOME_MEMBER_COUNT_URI: 'biz/home/member/count', // 首页用户数量

  METADATA_CHANNEL_ALL: 'metadata/channel/all',
  METADATA_DEPT_ALL: 'metadata/dept/all',
  METADATA_DEPT_TREE: 'metadata/dept/tree',
  METADATA_PERM_TREE: 'metadata/perm/tree',
  METADATA_DICT_LIST: 'metadata/dict/list',
  METADATA_DICT_ALL: 'metadata/dict/all',
  METADATA_UPLOAD_FILE: 'common/upload',
  /*===菜单管理===*/
  MENU_LIST_URI: 'system/menu/list', // 菜单列表
  MENU_REMOVE_URI: 'system/menu/remove', // 用户删除
  MENU_ADD_URI: 'system/menu/add', // 新增菜单
  MENU_EDIT_URI: 'system/menu/edit', // 编辑菜单
  MENU_DETAIL_URI: 'system/menu/detail', // 编辑菜单
  /*===用户管理===*/
  USER_DETAIL_URI: 'system/user/detail', // 用户列表
  USER_LIST_URI: 'system/user/list', // 用户列表
  USER_DELETE_URI: 'system/user/delete', // 用户删除
  USER_ADD_URI: 'system/user/add', // 用户新增
  USER_EDIT_URI: 'system/user/edit', // 用户编辑
  USER_UNLOCK_URI: 'system/user/unlock', // 用户解锁
  USER_RESETPWD_URI: 'system/user/resetPwd', // 用户重置密码
  /*===角色管理===*/
  ROLE_DETAIL_URI: 'system/role/detail', // 角色
  ROLE_LIST_URI: 'system/role/list', // 角色列表
  ROLE_REMOVE_URI: 'system/role/remove', // 用户删除
  ROLE_ADD_URI: 'system/role/add', // 角色新增
  ROLE_EDIT_URI: 'system/role/edit', // 角色编辑
  ROLE_ALLOCATED_USER_URI: 'auth/roleUser/allocatedList',
  ROLE_UNALLOCATED_USER_URI: 'auth/roleUser/unallocatedList',
  ROLE_AUTH_USER_URI: 'auth/roleUser/insert',
  ROLE_UNAUTH_USER_URI: 'auth/roleUser/cancel',
  /*===权限管理===*/
  PERM_LIST_URI: 'system/perm/list',
  PERM_REMOVE_URI: 'system/perm/remove',
  PERM_ADD_URI: 'system/perm/add',
  PERM_EDIT_URI: 'system/perm/edit',
  /*===操作日志===*/
  OPERATE_LOG_DETAIL_URI: 'system/operate/log/detail',
  OPERATE_LOG_LIST_URI: 'system/operate/log/list',
  OPERATE_LOG_REMOVE_URI: 'system/operate/log/remove',
  OPERATE_LOG_CLEAN_URI: 'system/operate/log/clean',
  /*===在线用户管理===*/
  ONLINE_DETAIL_URI: 'system/online/detail',
  ONLINE_LIST_URI: 'system/online/list',
  ONLINE_LOGOUT_URI: 'system/online/forceLogout',
  /*===配置管理===*/
  CONFIG_DETAIL_URI: 'system/config/detail',
  CONFIG_LIST_URI: 'system/config/list',
  CONFIG_REMOVE_URI: 'system/config/delete',
  CONFIG_ADD_URI: 'system/config/add',
  CONFIG_EDIT_URI: 'system/config/edit',
  /*===通知管理===*/
  NOTICE_DETAIL_URI: 'system/notice/detail',
  NOTICE_LIST_URI: 'system/notice/list',
  NOTICE_REMOVE_URI: 'system/notice/delete',
  NOTICE_ADD_URI: 'system/notice/add',
  NOTICE_EDIT_URI: 'system/notice/edit',
  /*===数据字典管理===*/
  DICT_DETAIL_URI: 'system/dict/type/detail',
  DICT_LIST_URI: 'system/dict/type/list',
  DICT_REMOVE_URI: 'system/dict/type/delete',
  DICT_ADD_URI: 'system/dict/type/add',
  DICT_EDIT_URI: 'system/dict/type/edit',
  DICT_DATA_DETAIL_URI: 'system/dict/data/detail',
  DICT_DATA_LIST_URI: 'system/dict/data/list',
  DICT_DATA_DELETE_URI: 'system/dict/data/delete',
  DICT_DATA_ADD_URI: 'system/dict/data/add',
  DICT_DATA_EDIT_URI: 'system/dict/data/edit',
  /*===部门管理===*/
  DEPT_LIST_URI: 'system/dept/list',
  DEPT_REMOVE_URI: 'system/dept/remove',
  DEPT_ADD_URI: 'system/dept/add',
  DEPT_EDIT_URI: 'system/dept/edit',
  /*===渠道管理===*/
  CHANNEL_DETAIL_URI: 'system/channel/detail',
  CHANNEL_LIST_URI: 'system/channel/list',
  CHANNEL_REMOVE_URI: 'system/channel/remove',
  CHANNEL_ADD_URI: 'system/channel/add',
  CHANNEL_EDIT_URI: 'system/channel/edit',

  /*===会员管理===*/
  MEMBER_DETAIL_URI: 'biz/member/detail',
  MEMBER_LIST_URI: 'biz/member/list',
  MEMBER_REMOVE_URI: 'biz/member/remove',
  MEMBER_ADD_URI: 'biz/member/add',
  MEMBER_EDIT_URI: 'biz/member/edit',
  MEMBER_RESET_PASSWORD_URI: 'biz/member/resetPassword',
 }
