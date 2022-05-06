import request from "./request";

// 获取搜索结果
export const searchRestaurant = async (geohash, keyword) => {
    return await request({
        url: '/v4/restaurants',
        params: {
            'extras[]': 'restaurant_activity',
            geohash,
            keyword,
            type: 'search'
        }
    })
}
// 搜索地址
export const searchNearby = async (keyword) => {
    return await request({
        url: '/v1/pois',
        params: {
            type: 'nearby',
            keyword
        }
    })
}
// 提交地址信息
export const postAddAddress = async (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => {
    return await request({
        url: `/v1/users/${userId}/addresses`,
        data: {
            address,
            address_detail,
            geohash,
            name,
            phone,
            phone_bk,
            poi_type,
            sex,
            tag,
            tag_type,
        },
        method: 'post',

    })
}