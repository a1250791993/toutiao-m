import request from '@/utils/request'

// 请求文章列表内容
export const getArticalList = (params) => request({
    method: 'GET',
    url: '/v1_0/articles',
    params
})

//获取文章
export const getArticleById = (articleId) => request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`,
})

/* 
收藏文章
*/
export const collectArticle = (target) => request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
        target
    }
})

/* 
取消收藏
 */
export const deleteArticle = (target) => request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`,

})

/* 
点赞文章
*/
export const addLike = (target) => request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
        target
    }
})

/* 
取消点赞收藏
 */
export const deleteLike = (target) => request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`,

})