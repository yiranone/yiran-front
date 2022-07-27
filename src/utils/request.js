import axios from 'axios'
import Cookie from 'js-cookie'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import { blobValidate } from '@/utils/dict-utils'

import { saveAs } from 'file-saver'

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'

axios.defaults.timeout = 5000
axios.defaults.withCredentials= true
axios.defaults.xsrfHeaderName= xsrfHeaderName
axios.defaults.xsrfCookieName= xsrfHeaderName
axios.defaults.transformResponse = [function (data) {
  try {
    /* eslint-disable no-undef */
    return jsonlint.parse(data)
  } catch (error) {
    return data
  }
}]

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2',
}

// http method
const METHOD = {
  GET: 'get',
  POST: 'post'
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, conf) {
  switch (method) {
    case METHOD.GET:
      return axios.get(`/api/${url}`, {params})
    case METHOD.POST:
      return axios.post(`/api/${url}`, params, conf)
    default:
      return axios.get(`/api/${url}`, {params})
  }
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.set(xsrfHeaderName, auth.token, {expires: 7})
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.remove(xsrfHeaderName)
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (Cookie.get(xsrfHeaderName)) {
        return true
      }
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
  return false
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const {request, response} = interceptors
  // 加载请求拦截器
  // debugger
  request.forEach(item => {
    let {onFulfilled, onRejected} = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    )
  })
  // 加载响应拦截器
  response.forEach(item => {
    let {onFulfilled, onRejected} = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    )
  })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
  }
  return params
}

// 通用下载方法
function download (url, params, filename) {
  const notificationKey = 'download'
  notification.open({
    key: notificationKey,
    message: '正在下载数据，请稍候',
    duration: null,
    icon: h => {
      return h(
          'a-icon',
          {
            props: {
              type: 'loading'
            }
          }
      )
    }
  })
  const config = {
    method: 'get',
    url: "api/" + url,
    headers: { 'Content-Type': 'application/json' },
    responseType: 'blob',
    transformResponse: function (data){return data}
  };
  const request2 = axios.create({
    timeout: 6000, // 请求超时时间
  })
  return request2.post("api/" + url, params,{ responseType: "blob" } ).then(async (resp) => {
    debugger
    const { data, headers } = resp

    const isBlob = blobValidate(data)
    if (isBlob) {
      // const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
      const blob = new Blob([data])
      let url = window.URL.createObjectURL(blob)
      let dom = document.createElement('a')
      dom.href = url
      dom.download = decodeURI(filename)
      dom.style.display = 'none'
      document.body.appendChild(dom)
      dom.click()
      dom.parentNode.removeChild(dom)
      window.URL.revokeObjectURL(url)

      // saveAs(blob, filename)
      message.success('下载成功')
    } else {
      const resText = resp.text()
      const rspObj = JSON.parse(resText)
      const errMsg = rspObj.msg
      message.error(errMsg)
    }
    notification.close(notificationKey)
  }).catch((r) => {
    debugger
    message.error('下载文件出现错误，请联系管理员！')
    notification.close(notificationKey)
  })
}

export {
  METHOD,
  AUTH_TYPE,
  request,
  download,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams
}
