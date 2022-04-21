// 导入路由
const App = () => import('.././App.vue')
const Home = () => import('@/views/home/home.vue')
const City = () => import('@/views/city/city.vue')
const Msite = () => import('@/views/msite/msite.vue')
const Login = () => import('@/views/login/login.vue')
const Forget = () => import('@/views/forget/forget.vue')
const Food = () => import('@/views/food/food.vue')
const Search = () => import('@/views/search/search.vue')
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
        }
    ]
}]