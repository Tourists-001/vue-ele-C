// 导入路由
const App = () => import('.././App.vue')
const Home = () => import('@/views/home/home.vue')
const City = () => import('@/views/city/city.vue')
const Msite = () => import('@/views/msite/msite.vue')
const Login = () => import('@/views/login/login.vue')
const Forget = () => import('@/views/forget/forget.vue')
const Food = () => import('@/views/food/food.vue')
const Search = () => import('@/views/search/search.vue')
const Shop = () => import('@/views/shop/shop.vue')
const ShopDetail = () => import('@/views/shop/children/shopDetail.vue')
const ShopSafe = () => import('@/views/shop/children/children/shopSafe.vue')
const foodDetail = () => import('@/views/shop/children/foodDetail.vue')
const confirmOrder = () => import('@/views/confirmOrder/confirmOrder.vue')
const chooseAddress = () => import('@/views/confirmOrder/children/chooseAddress.vue')
const addAddress = () => import('@/views/confirmOrder/children/children/addAddress.vue')
const searchAddress = () => import('@/views/confirmOrder/children/children/children/searchAddress.vue')
const remark = () => import('@/views/confirmOrder/children/remark.vue')
const invoice = () => import('@/views/confirmOrder/children/invoice.vue')
const userValidation = () => import('@/views/confirmOrder/children/userValidation.vue')
const payment = () => import('@/views/confirmOrder/children/payment.vue')
const order = () => import('@/views/order/order.vue');
const orderDetail = () => import('@/views/order/children/orderDetail.vue')
const profile = () => import('@/views/profile/profile.vue')
const info = () => import('@/views/profile/children/info.vue')
const setusername = () => import('@/views/profile/children/children/setusername.vue')
const address = () => import('@/views/profile/children/children/address.vue')
const add = () => import('@/views/profile/children/children/children/add.vue')
const addEdit = () => import('@/views/profile/children/children/children/children/addEdit.vue')
const benefit = () => import('@/views/benefit/benefit.vue')
const hbDescription = () => import('@/views/benefit/children/hbDescription.vue')
const hbHistory = () => import('@/views/benefit/children/hbHistory.vue')
const exchange = () => import('@/views/benefit/children/exchange.vue')
const commend = () => import('@/views/benefit/children/commend.vue')
const coupon = () => import('@/views/benefit/children/coupon.vue')
const balance = () => import('@/views/balance/balance.vue')
const detail = () => import('@/views/balance/children/detail.vue')
const points = () => import('@/views/points/points.vue')
const pointsDetail = () => import('@/views/points/children/pointsDetail.vue')
const vipCard = () => import('@/views/vipCard/vipCard.vue')
const service = () => import('@/views/service/service.vue')
const download = () => import('@/views/download/download.vue')
export default [{
    path: '/',
    component: App,
    children: [{
            path: '/',
            redirect: '/home',
        },
        //首页城市列表页
        {
            path: '/home',
            component: Home
        },
        // 搜索城市列表
        {
            path: '/city/:cityId',
            component: City
        },
        //所有商铺列表页
        {
            path: '/msite',
            component: Msite,
            meta: {
                keepAlive: true
            },
        },
        //登录注册页
        {
            path: '/login',
            component: Login
        },
        // 忘记密码
        {
            path: '/forget',
            component: Forget,
        },
        // 分类
        {
            path: '/food',
            component: Food,
        },
        // 搜索页面
        {
            path: '/search/:geohash',
            component: Search,
        },
        //商铺详情页
        {
            path: '/shop',
            component: Shop,
            children: [{
                path: 'shopDetail', //商铺详情页
                component: ShopDetail,
                children: [{
                    path: 'shopSafe',
                    component: ShopSafe
                }]
            }, ]
        },
        {
            path: '/foodDetail',
            component: foodDetail,
        },
        // 订单页
        {
            path: '/confirmOrder',
            component: confirmOrder,
            children: [{
                    path: 'chooseAddress', // 修改地址页,切换地址
                    component: chooseAddress,
                    children: [{
                        path: 'addAddress', // 添加地址
                        component: addAddress,
                        children: [{
                            path: 'searchAddress', // 搜索详细地址
                            component: searchAddress
                        }]
                    }]
                },
                {
                    path: 'remark', // 订单备注页
                    component: remark,
                },
                {
                    path: 'invoice', // 是否需要发票
                    component: invoice,
                },
                {
                    path: 'userValidation', // 手机验证页面
                    component: userValidation,
                },
                {
                    path: 'payment', // 支付页面
                    component: payment
                }
            ]
        },
        // 未支付页面
        {
            path: '/order',
            component: order,
            children: [{ // 订单详情页
                path: 'orderDetail',
                component: orderDetail
            }]
        },
        // 用户界面
        {
            path: 'profile',
            component: profile,
            children: [{
                path: 'info',
                component: info,
                children: [{
                    path: 'setusername', // 修改用户名
                    component: setusername
                }, {
                    path: 'address',
                    component: address,
                    children: [{
                        path: 'add',
                        component: add,
                        children: [{
                            path: 'addEdit',
                            component: addEdit,
                        }]
                    }]
                }]
            }]
        },
        // benefit
        {
            path: '/benefit', // 优惠券
            component: benefit,
            children: [{
                path: 'hbDescription',
                component: hbDescription
            }, {
                path: 'hbHistory',
                component: hbHistory
            }, {
                path: 'exchange',
                component: exchange
            }, {
                path: 'commend',
                component: commend,
            }, {
                path: 'coupon',
                component: coupon,
            }]
        },
        {
            path: '/balance',
            component: balance, // 余额
            children: [{
                path: 'detail',
                component: detail
            }]
        },
        {
            path: '/points', // 积分
            component: points,
            children: [{
                path: 'pointsDetail',
                component: pointsDetail
            }]
        },
        {
            path: '/vipCard', // 会员卡
            component: vipCard
        },
        {
            path: '/service', // 服务中心
            component: service
        },
        {
            path: '/download', //下载
            component: download,
        }
    ],
}]