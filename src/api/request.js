import axios from "axios";

const request = axios.create({
    // baseURL: 'http://cangdu.org:8001',
    timeout: 5000,
})
//请求拦截器
// request.interceptors.request.use((config) => {
//     console.log(config);
//     if(config.method !== 'post') {
//         config.headers = {...config.headers,Cookie:document.cookie}
//         console.log(document.cookie);
//     }
//     return config
// })
//响应拦截器
request.interceptors.response.use((config) => {
    return config.data
}, () => {
    return Promise.reject(new Error('数据请求失败'))
})

export default request