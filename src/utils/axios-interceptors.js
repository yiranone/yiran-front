import Cookie from 'js-cookie'
import {removeAuthorization} from "@/utils/request";
import {authUrl, loginIgnore, router} from '@/router'
// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    if (response.status === 401) {
      message.error('无此接口权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const {message} = options
    if (response.status === 403) {
      message.error(`请求被拒绝`)
    }
    return response
  }
}

const respCommon = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    let res = response.data
    //下载文件的处理
    const respHeader = response.headers['content-type'];
    if(respHeader.indexOf("application/vnd.openxmlformats") == 0 || respHeader.indexOf("application/x-msdownload") == 0)
      return response;
    if(respHeader.indexOf("application/json") < 0)
      return response;
    if (res.code === 200) {
      // message.error('无此接口权限')
      // console.info(router)
      // console.info(router.currentRoute.path)
      return res.data
    } else if (res.code === 401) {
      // 用户没有登录
      console.info("用户没有登录:" + res.msg)
      const currentPath = router.currentRoute.path;
      if("/login" != currentPath) { //当前页面不是登录页面，跳转到登录页面
        router.push({ path: '/login' })
        message.warn(res.msg)
      }
      removeAuthorization() //用户没有登录，删除token
      return Promise.reject(res)
    } else {
      if(res.msg != null)
        message.warn(res.msg)
      return Promise.reject(res)
    }
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const {message} = options
    const {url, xsrfCookieName} = config
    if (authUrl.needLogin(url) && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
      message.warning('认证 token 已过期，请重新登录')
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [respCommon] // 响应拦截
}
