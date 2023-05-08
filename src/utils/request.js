import axios from 'axios'
import Cookie from 'js-cookie'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import { blobValidate } from '@/utils/dict-utils'

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'

axios.defaults.timeout = 35000
axios.defaults.withCredentials= true
axios.defaults.xsrfHeaderName= xsrfHeaderName
axios.defaults.xsrfCookieName= xsrfHeaderName
// axios.defaults.transformResponse = [function (data) {
//   try {
//     /* eslint-disable no-undef */
//     return jsonlint.parse(data)
//   } catch (error) {
//     return data
//   }
// }]

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
 */
function setAuthorization(auth) {
  Cookie.set(xsrfHeaderName, auth.token, {expires: 7})
}

/**
 * 移出认证信息
 */
function removeAuthorization() {
  Cookie.remove(xsrfHeaderName)
}

/**
 * 检查认证信息
 * @returns {boolean}
 */
function checkAuthorization() {
  if (Cookie.get(xsrfHeaderName)) {
    return true
  }
  return false
}

function randomTest() {

  return 'false'
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const {request, response} = interceptors
  // 加载请求拦截器
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

  const downloadRequest = axios.create({
    timeout: 6000, // 请求超时时间
  })

  return request( url, METHOD.POST, params,{ responseType: "blob" } ).then(async (resp) => {
    const { data, headers } = resp
    const isBlob = blobValidate(data)
    if (isBlob) {
      const blob = new Blob([data])
      // console.log(data.length)
      // console.log(data)
      let url = window.URL.createObjectURL(blob)
      let dom = document.createElement('a')
      dom.href = url
      dom.download = decodeURI(filename)
      dom.style.display = 'none'
      document.body.appendChild(dom)
      dom.click()
      dom.parentNode.removeChild(dom)
      window.URL.revokeObjectURL(url)
      message.success('下载成功')
    } else {
      const resText = resp.text()
      const rspObj = JSON.parse(resText)
      const errMsg = rspObj.msg
      message.error(errMsg)
    }
    notification.close(notificationKey)
  }).catch((r) => {
    message.error('下载文件出现错误，请联系管理员！')
    notification.close(notificationKey)
  })
}

export {
  METHOD,
  request,
  download,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams,
  randomTest
}
