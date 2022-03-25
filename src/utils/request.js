/* 
请求模块 
*/
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const request = axios.create({
    baseURL: 'http://toutiao.itheima.net', //接口的基本路径

    //自定义后端返回的原始数据
    //data:后端返回的原始数据，就是JSON格式的字符串
    transformResponse: [function (data) {
        try {
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }
    }]
})


// 请求拦截器
request.interceptors.request.use(function (config) {
    //请求发起会经过这里
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // 这里一定要返回config对象，否则请求就停在这里了
    return config
}, function (error) {
    // 如果请求出错了（请求还未发出去）
    return Promise.reject(error)
})



export default request

