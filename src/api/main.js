// 商品相关
import request from "./request"

//获取msite页面食品分类列表
export const msiteFoodTypes = async (geohash) => {
    return await request({
        url: '/v2/index_entry',
        data: {
            geohash,
            group_type: '1',
            'flags[]': 'F'
        }
    })
}
// 获取店铺列表
export const shopList = async (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
    let supportStr = '';
    support_ids.forEach(item => {
        if (item.status) {
            supportStr += '&support_ids[]=' + item.id;
        }
    });
    let data = {
        latitude,
        longitude,
        offset,
        limit: '20',
        'extras[]': 'activities',
        keyword: '',
        restaurant_category_id,
        'restaurant_category_ids[]': restaurant_category_ids,
        order_by,
        'delivery_mode[]': delivery_mode + supportStr
    };
    return await request({
        url: '/shopping/restaurants',
        params: data
        
    })
}