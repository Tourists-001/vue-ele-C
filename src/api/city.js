// 城市接口
import request from "./request";
// 获取当前城市
export const cityGuess = async () => {
    return await request({
        url: 'http://cangdu.org:8001/v1/cities',
        params: {
            type: 'guess'
        }
    })
}

// 获取热门城市
export const hotCity = async () => {
    return await request({
        url: '/v1/cities',
        params: {
            type: 'hot'
        }
    })
}
// 获取城市群
export const groupCity = async () => {
    return await request({
        url: '/v1/cities',
        params: {
            type: 'group'
        }
    })
}
// 获取当前所在城市
export const currentCity = async (id) => {
    return await request({
        url: `/v1/cities/${id}`
    })
}

// 获取搜索地址
export const searchPlace = async (cityId, value) => {
    return await request({
        url: '/v1/pois',
        params: {
            type: 'search',
            city_id: cityId,
            keyword: value
        },
    })
}

// 在主页获取位置信息
export const msiteAddress = async (geohash) => {
    return await request({
        url: `/v2/pois/${geohash}`,
    })
}