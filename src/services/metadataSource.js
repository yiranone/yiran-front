import API from './api'
import {METHOD, request} from '@/utils/request'

const ms = {

  channelAll: async (params) => {
    return request(API.METADATA_CHANNEL_ALL, METHOD.POST, params)
  },
  deptAll: async (params) => {
    return request(API.METADATA_DEPT_ALL, METHOD.POST, params)
  },
  deptTree: async (params) => {
    return request(API.METADATA_DEPT_TREE, METHOD.POST, params)
  },
  permTree: async (params) => {
    return request(API.METADATA_PERM_TREE, METHOD.POST, params)
  },
  dictList: async (params) => {
    return request(API.METADATA_DICT_LIST, METHOD.POST, params)
  },
  dictAll: async () => {
    return request(API.METADATA_DICT_ALL, METHOD.POST)
  },
  dictListByType: async (dictType) => {
    return ms.dictList({"dictType":dictType})
  },
  uploadFile: async (params) => {
    return request(API.METADATA_UPLOAD_FILE, METHOD.POST,params)
  },
}

export default ms
