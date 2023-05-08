// 日期格式化
import store from "@/store";

export function parseTime (time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '')
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return timeStr
}

// 回显数据字典
export function selectDictLabel (datas, value) {
    var actions = []
    Object.keys(datas).some((key) => {
        if (datas[key].value === ('' + value)) {
            if(datas[key].cssClass != null ) {
                actions.push("<a class=\"ant-tag ant-tag-"+datas[key].cssClass+"\" style=\" \">" + datas[key].label + "</a>")
            } else {
                actions.push(datas[key].label)
            }
            return true
        }
    })
    return actions.join('')
}

// 回显数据字典（字符串数组）
export function selectDictLabels (datas, value, separator) {
    var actions = []
    var currentSeparator = undefined === separator ? ',' : separator
    var temp = value.split(currentSeparator)
    Object.keys(value.split(currentSeparator)).some((val) => {
        Object.keys(datas).some((key) => {
            if (datas[key].value === ('' + temp[val])) {
                actions.push(datas[key].label + currentSeparator)
            }
        })
    })
    return actions.join('').substring(0, actions.join('').length - 1)
}

// 验证是否为blob格式
export async function blobValidate (data) {
    try {
        const text = await data.text()
        JSON.parse(text)
        return false
    } catch (error) {
        return true
    }
}

// 添加日期范围
export function addDateRange (params, dateRange, propName) {
    if(params == null)
        params = {}
    if (dateRange != null && dateRange != '' && dateRange.length === 2) {
        if (typeof (propName) === 'undefined') {
            params['beginTime'] = dateRange[0]
            params['endTime'] = dateRange[1]
        } else {
            params[propName + 'BeginTime'] = dateRange[0]
            params[propName + 'EndTime'] = dateRange[1]
        }
    }
    return params
}

export function hasPermission(value){

    const isAdmin = store.getters && store.getters.user && store.getters.user.isAdmin
    if (isAdmin)
        return true

    const permissions = store.getters && store.getters.permissions
    if (permissions == null)
        return false

    if (value && ( value instanceof String  || (typeof value).toLowerCase() == 'string' ) && value.length > 0) {
        const permissionFlag = value
        const hasPermissions = permissions.some(permission => {
            return permissionFlag == permission
        })
        return hasPermissions
    } else if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value
        const hasPermissions = permissions.some(permission => {
            return permissionFlag.includes(permission)
        })
        return hasPermissions
    }
}
