import {METHOD, request} from "@/utils/request";
//获取验证图片  以及token
export function reqGet(data) {
    return request('/captcha/get', METHOD.POST, data)
}

//滑动或者点选验证
export function reqCheck(data) {
	return request('/captcha/check', METHOD.POST, data)
}


