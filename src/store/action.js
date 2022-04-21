import {
    getUser
} from '@/api/user'
import {
    GET_USERINFO,
} from './mutations-types'
export default {
    // 获取用户信息
    async getUserInfo({
        commit,
    }) {
        let res = await getUser();
        commit(GET_USERINFO, res)
    }
}