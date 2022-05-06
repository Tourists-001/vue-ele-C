import {
    setStore,
    getStore,
    removeStore,
} from '@/config/nUtils';
import {
    RECORD_USERINFO,
    GET_USERINFO,
    SAVE_GEOHASH,
    RECORD_ADDRESS,
    RECORD_SHOPDETAIL,
    ADD_CART,
    REDUCE_CART,
    INIT_BUYCART,
    CLEAR_CART,
    DETAIL_FOODS,
    SAVE_SHOPID,
    SAVE_CART_ID_SIG,
    CHOOSE_ADDRESS,
    CHOOSE_SEARCH_ADDRESS,
    CONFIRM_ADDRESS,
    CONFIRM_REMARK,
    CONFIRM_INVOICE,
    SAVE_ORDER_PARAM,
    NEED_VALIDATION,
    ORDER_SUCCESS,
    SAVE_ORDER,
    SAVE_AVANDER,
    RETSET_NAME,
    SAVE_ADDDETAIL,
    ADD_ADDRESS,
    SAVE_ADDRESS,
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
        if (!info) {
            return
        }
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
        state.geohash = geohash
    },
    // 记录当前经纬度
    [RECORD_ADDRESS](state, {
        latitude,
        longitude
    }) {
        state.latitude = latitude;
        state.longitude = longitude;
    },
    [RECORD_SHOPDETAIL](state, detail) {
        state.shopDetail = detail;
    },
    // 加入购物车
    [ADD_CART](state, {
        shopid,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
        packing_fee,
        sku_id,
        stock
    }) {
        let cart = state.cartList;
        let shop = cart[shopid] = (cart[shopid] || {});
        let category = shop[category_id] = (shop[category_id] || {});
        let item = category[item_id] = (category[item_id] || {});
        if (item[food_id]) {
            item[food_id]['num']++;
        } else {
            item[food_id] = {
                "num": 1,
                "id": food_id,
                "name": name,
                "price": price,
                "specs": specs,
                "packing_fee": packing_fee,
                "sku_id": sku_id,
                "stock": stock
            };
        }
        state.cartList = {
            ...cart
        };
        // console.log( ...cart);
        //存入localStorage
        setStore('buyCart', state.cartList);
    },
    // 移出购物车
    [REDUCE_CART](state, {
        shopid,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
    }) {
        let cart = state.cartList;
        let shop = (cart[shopid] || {});
        let category = (shop[category_id] || {});
        let item = (category[item_id] || {});
        if (item && item[food_id]) {
            if (item[food_id]['num'] > 0) {
                item[food_id]['num']--;
                state.cartList = {
                    ...cart
                };
                //存入localStorage
                setStore('buyCart', state.cartList);
            } else {
                //商品数量为0，则清空当前商品的信息
                item[food_id] = null;
            }
        }
    },
    //清空当前商品的购物车信息
    [CLEAR_CART](state, shopid) {
        state.cartList[shopid] = null;
        state.cartList = {
            ...state.cartList
        };
        setStore('buyCart', state.cartList);
    },
    //网页初始化时从本地缓存获取购物车数据
    [INIT_BUYCART](state) {
        let initCart = getStore('buyCart');
        if (initCart) {
            state.cartList = JSON.parse(initCart);
        }
    },
    // 保存商品详情的数据
    [DETAIL_FOODS](state, res) {
        state.foods = res
    },
    // 保存商铺ID
    [SAVE_SHOPID](state, id) {
        state.shopid = id
    },
    // 保存订单检验数据
    [SAVE_CART_ID_SIG](state, {
        cart_id,
        sig
    }) {
        state.cartId = cart_id
        state.sig = sig
    },
    // 购买的地址
    [CHOOSE_ADDRESS](state, {
        address,
        index
    }) {
        state.choosedAddress = address;
        state.addressIndex = index

    },
    // 搜搜选择的详细地址
    [CHOOSE_SEARCH_ADDRESS](state, item) {
        state.searchAddress = item
    },
    // 保存地址信息
    [CONFIRM_ADDRESS](state, res) {
        state.newAddress.push(res);
        // console.log(state.newAddress);
    },
    // 保存订单备注
    [CONFIRM_REMARK](state, {
        remarkText,
        inputText
    }) {
        state.remarkText = remarkText;
        state.inputText = inputText;
    },
    // 是否有发票
    [CONFIRM_INVOICE](state, invoice) {
        state.invoice = invoice
    },
    //保存下单参数，用户验证页面调用
    [SAVE_ORDER_PARAM](state, orderParam) {
        state.orderParam = orderParam;
    },
    // 保存下单需要验证的返回值
    [NEED_VALIDATION](state, needValidation) {
        state.needValidation = needValidation
    },
    [ORDER_SUCCESS](state, order) {
        state.cartPrice = null
        state.orderMessage = order;
    },
    // 保存某个order的详细信息
    [SAVE_ORDER](state, orderItem) {
        state.orderDetail = orderItem
    },
    // 保存用户头像
    [SAVE_AVANDER](state, avatar) {
        state.imgPath = avatar
    },
    // 保存修改的用户名
    [RETSET_NAME](state, username) {
        state.userInfo = Object.assign({}, state.userInfo, {
            username
        })
    },
    // 保存用户搜索到的地址的名称
    [SAVE_ADDDETAIL](state, name) {
        state.addAddress = name
    },
    // 保存用户地址信息
    [ADD_ADDRESS](state, info) {
        state.removeAddress = [info, ...state.removeAddress];
    },
    //删除地址列表
    [SAVE_ADDRESS](state, newAdress) {
        state.removeAddress = newAdress
    },
}