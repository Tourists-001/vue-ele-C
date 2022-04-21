import {
    setStore
} from '@/config/nUtils';
import {
    RECORD_USERINFO,
    GET_USERINFO,
    SAVE_GEOHASH,
    RECORD_ADDRESS,
} from './mutations-types';
export default {
    // 记录用户信息
    [RECORD_USERINFO](state, info) {
        state.userInfo = info
        state.login = true
        setStore('user_id', info.user_id)
    },
    // 获取用户信息存入vux
    [GET_USERINFO](state, info) {
        if (state.userInfo && (state.userInfo.userInfo !== info.username)) {
            return
        }
        if (!state.login) {
            return
        }
        if (!info.message) {
            state.userInfo = {
                ...info
            };
        } else {
            state.userInfo = null;
        }
    },
    // 保存 geohash
    [SAVE_GEOHASH](state, geohash) {
        state.newAddress = geohash
    },
    // 记录当前经纬度
    [RECORD_ADDRESS](state, {
        latitude,
        longitude
    }) {
        state.latitude = latitude;
        state.longitude = longitude;
    }
}