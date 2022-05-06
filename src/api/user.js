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
    // console.log(getStore('user_id'));
    if (!getStore('user_id')) {
        return
    }
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

// 上传头像
export const upLoadAvatar = async (userId, data) => {
    return await request({
        url: `/eus/v1/users/${userId}/avatar`,
        credentials: "include",
        method: 'post',
        data,
    })
}
// 删除地址
export const deleteAddress = async (userid, addressid) => {
    return await request({
        url: `/v1/users/${userid}/addresses/${addressid}`,
        data: {},
        method: 'DELETE'
    })
}

// 获取红包信息
export const getHongbaoNum = async (id) => {
    return await request({
        url: `/promotion/v2/users/${id}/hongbaos?limit=20&offset=0`
    })
}

// 获取红包历史记录
export const getExpired = async (id) => {
    return await request({
        url: `/promotion/v2/users/${id}/expired_hongbaos?limit=20&offset=0`
    })
}

// 获取兑换码
export const exChangeHongbao = async (id, exchange_code, captcha_code) => {
    return await request({
        url: `/v1/users/${id}/hongbao/exchange`,
        data: {
            exchange_code,
            captcha_code
        },
        method: 'post'
    })
}