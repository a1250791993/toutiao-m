// 请求评论模块

import request from "@/utils/request";

export const getComments = (params) => request({
    method: 'GET',
    url: '/v1_0/comments',
    params
})

//对评论或者评论回复进行点赞
export const addLike = (target) => request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
        target
    }
})

//取消对评论或者评论回复进行点赞
export const deleteLike = (target) => request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`,
})

//对文章或者评论进行回复
export const addComment = (data) => request({
    method: 'POST',
    url: '/v1_0/comments',
    data
})