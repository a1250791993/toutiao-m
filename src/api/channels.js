/* 
请求获取频道模块
*/
import request from '@/utils/request'


/* 获取所有频道 */
export const getAllChannels = () => request({
    method: 'GET',
    url: '/v1_0/channels'
})

/* 
添加用户频道
*/
export const addUserChannels = (channel) => request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
        channels: [channel]
    }
})

/* 
删除用户频道
*/
export const deleteUserChannels = (channelId) => request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`,
})