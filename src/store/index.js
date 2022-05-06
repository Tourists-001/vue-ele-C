import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
Vue.use(Vuex)

const state = {
    userInfo: null, // 用户信息
    newAddress: [], // 地址信息
    latitude: '', // 当前位置维度
    longitude: '', // 当前位置经度
    login: true, //是否登录
    geohash: '31.22299,121.36025', //地址geohash值
    shopDetail: {}, // 商铺信息
    cartList: {}, // 购物车的信息
    foods: [],
    shopid: '', // 商铺id
    cartId: null, //购物车id
    sig: null, //购物车sig
    choosedAddress: '', //选择地址信息
    addressIndex: null, //选择地址的索引值
    searchAddress: null, // 搜索选择的地址
    address: [], // 新添加的地址
    remarkText: '', // 备注信息
    inputText: '',
    invoice: null, // 是否需要发票
    orderParam: '', // 保存订单信息
    needValidation: null, //确认订单时是否需要验证
    cartPrice: null, //会员卡价格
    orderMessage: null, //订单返回的信息
    orderDetail: null, // 某个order的详细信息
    imgPath: null, // 用户头像
    addAddress: null, // 用户地址
    removeAddress: [], //移除地址

}
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})