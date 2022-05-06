import {
    getUser
} from '@/api/user'
import {
    getAddressList
} from '@/api/shop'
import {
    GET_USERINFO,
    SAVE_ADDRESS,
} from './mutations-types'
export default {
    // 获取用户信息
    async getUserInfo({
        commit,
    }) {
        let res = await getUser();
        commit(GET_USERINFO, res)
    },
    async saveAddress({
        commit,
        state
    }) {
        if (state.removeAddress.length > 0) return
        let addres = await getAddressList(state.userInfo.user_id);
        commit(SAVE_ADDRESS, addres);
    }
}