import store from '@/store'
import {hasPermission} from "@/utils/dict-utils";

export default {
  inserted (el, binding, vnode) {
    const { value } = binding

    const has = hasPermission(value)
    if (!has) {
       el.parentNode && el.parentNode.removeChild(el)
    } else {
      // console.info("请设置操作权限标签值" + el.parentNode.outerHTML)
      //throw new Error(`请设置操作权限标签值`)
    }
  }
}
