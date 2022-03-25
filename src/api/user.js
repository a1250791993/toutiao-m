/* 
用户相关的请求模块
*/

import request from '@/utils/request'

export const login = data => request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
})

// 发送验证码  一分钟一次
export const sendSms = mobile => request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`,
})

/* 
请求用户自己的信息
*/
export const getUserInfo = () => request({
    method: 'GET',
    url: '/v1_0/user',
    // 发送请求头数据
    // 统一进行了封装在utils/request中的请求拦截器中
    // headers: {
    //     Authorization: `Bearer ${store.state.user.token}`
    // }
})

/* 
请求获取用户
*/

export const getChannels = () => request({
    method: 'GET',
    url: '/v1_0/user/channels'
})

/* 
关注用户
*/
export const addFlow = (target) => request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
        target
    }
})

/* 
取消关注用户
*/
export const deleteFlow = (target) => request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`,
})
