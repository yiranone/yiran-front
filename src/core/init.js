import Vue from 'vue'

import {parseTime, selectDictLabel, selectDictLabels, addDateRange, hasPermission} from '@/utils/dict-utils'
import { download } from '@/utils/request'

import permission from '@/directive/permission'

import './filter'
// base library
import VueCropper from 'vue-cropper'
import Ellipsis from '@/components/ellipsis'
import TableSetting from '@/components/table-setting'
import moment from "moment";

Vue.use(VueCropper)

Vue.component('ellipsis', Ellipsis)
Vue.component('table-setting', TableSetting)

Vue.use(permission) // 通过 v-hasPerm['xxx'] 判断权限

Vue.prototype.hasPermission=hasPermission
Vue.prototype.parseTime=parseTime
Vue.prototype.selectDictLabel=selectDictLabel
Vue.prototype.selectDictLabels=selectDictLabels
Vue.prototype.addDateRange=addDateRange
Vue.prototype.download = download
Vue.prototype.$moment = moment;

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] WARNING: Antd now use fulled imported.')
