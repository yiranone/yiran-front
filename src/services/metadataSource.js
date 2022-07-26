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
  dictList: async (params) => {
    return request(API.METADATA_DICT_LIST, METHOD.POST, params)
  },
  dictListByType: async (dictType) => {
    return ms.dictList({"dictType":dictType})
  },
}

export default ms
