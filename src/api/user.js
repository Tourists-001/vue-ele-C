// 用户相关的接口
import request from "./request";
import {
    getStore
} from '@/config/nUtils';

// 获取图片验证码
export const getCaptchas = async () => {
    return await request({
        url: '/v1/captchas',
        data: {},
        method: 'post'
    })
}
// 账号密码登录
export const accountLogin = async (username, password, captcha_code) => {
    return await request({
        url: '/v2/login',
        data: {
            username,
            password,
            captcha_code
        },
        method: 'post'
    })
}
// 检测账号是否存在
export const checkExsis = async (checkNumber, type) => {
    return await request({
        url: '/v1/users/exists',
        data: {
            [type]: checkNumber,
            type
        }
    })
}
// 获取用户信息
export const getUser = async () => {
    return await request({
        url: '/v1/user',
        data: {
            user_id: getStore('user_id')
        }
    })
}

// 修改密码
export const changePassword = async (username, oldpassWord, newpassword, confirmpassword, captcha_code) => {
    return await request({
        url: '/v2/changepassword',
        data: {
            username,
            oldpassWord,
            newpassword,
            confirmpassword,
            captcha_code
        },
        method: 'post'
    })
}