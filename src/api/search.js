/* 
搜索模块
*/

import request from "@/utils/request";

/* 联想建议 */
export const getSuggestions = (q) => request({
    url: '/v1_0/suggestion',
    method: 'GET',
    params: {
        q
    }
})

// 搜索结果
export const getResult = params => request({
    url: '/v1_0/search',
    method: 'GET',
    params
})

