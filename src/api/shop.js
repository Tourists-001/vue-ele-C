import request from "./request";

export const shopDetails = async (shopid, latitude, longitude) => {
    return await request({
        url: `/shopping/restaurant/${shopid}`,
        params: {
            latitude,
            longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
        }
    })
}

export const foodMenu = async (restaurant_id) => {
    return await request({
        url: '/shopping/v2/menu',
        params: {
            restaurant_id
        }
    })
}

// 获取商铺评价分数
export const ratingScores = async (shopid) => {
    return await request({
        url: `/ugc/v2/restaurants/${shopid}/ratings/scores`,
    })
}

// 获取商铺评价分类
export const ratingTags = async (shopid) => {
    return await request({
        url: `/ugc/v2/restaurants/${shopid}/ratings/tags`
    })
}

// 获取评论
export const getRatingList = async (shopid, offset, tag_name = '') => {
    return await request({
        url: `/ugc/v2/restaurants/${shopid}/ratings`,
        params: {
            has_content: true,
            offset,
            limit: 10,
            tag_name
        }
    })
}

// 检验订单是否满足条件
export const checkout = async (geohash, entities, shopid) => {
    return await request({
        url: '/v1/carts/checkout',
        data: {
            come_from: "web",
            geohash,
            entities,
            restaurant_id: shopid,
        },
        method: 'post',
    })
}

// 获取用户地址
export const getAddressList = async (user_id) => {
    return await request({
        url: `/v1/users/${user_id}/addresses`
    })
}

// 获取备注分类
export const getRemark = async (id, sig) => {
    return await request({
        url: `/v1/carts/${id}/remarks`,
        data: {
            sig
        }
    })
}
// 提交订单
export const placeOrders = async (user_id, cart_id, address_id, description, entities, geohash, sig) => {
    return await request({
        url: `/v1/users/${user_id}/carts/${cart_id}/orders`,
        data: {
            address_id,
            come_from: "mobile_web",
            deliver_time: "",
            description,
            entities,
            geohash,
            paymethod_id: 1,
            sig,
        },
        method: 'post'
    })
}
// 重新发送订单验证码
export const payRequest = async (merchantOrderNo, userId) => {
    return await request({
        url: '/payapi/payment/queryOrder',
        data: {
            merchantId: 5,
            merchantOrderNo,
            source: 'MOBILE_WAP',
            userId,
            version: '1.0.0',
        }
    })
}

// 获取订单
export const getOrderList = async (user_id, offset) => {
    return await request({
        url: `/bos/v2/users/${user_id}/orders`,
        params: {
            limit: 10,
            offset,
        }
    })
}
// 获取订单详细信息
export const getOrderDetail = async (user_id, orderid) => {
    return await request({
        url: `/bos/v1/users/${user_id}/orders/${orderid}/snapshot`,
    })
}