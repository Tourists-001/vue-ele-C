import request from "./request";


// 获取food页面的 category 种类列表
export const foodCategory = async (latitude, longitude) => {
    return await request({
        url: '/shopping/v2/restaurant/category',
        params: {
            latitude,
            longitude
        }
    })
}

// 获取配送方式
export const foodDelivery = async (latitude, longitude) => {
    return await request({
        url: '/shopping/v1/restaurants/delivery_modes',
        params: {
            latitude,
            longitude
        }
    })
}
// 获取food页面的商家属性活动列表
export const foodActivity = async (latitude, longitude) => {
    return await request({
        url: '/shopping/v1/restaurants/activity_attributes',
        params: {
            latitude,
            longitude
        }
    })
}