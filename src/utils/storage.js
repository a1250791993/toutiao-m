/* 
封装本地存储操作模块
*/

/* 
存储数据
*/
export const setItem = (key, value) => {
    // 把数组或者对象转为JSON字符串
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }

    window.localStorage.setItem(key, value)
}


/* 
获取数据
*/
export const getItem = (key) => {
    const data = window.localStorage.getItem(key)
    // 如果拿到的是JSON字符串，把他解析，如果不是，直接原本返回
    try {
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}

/* 
删除数据
*/
export const removeItem = (key) => {
    window.localStorage.removeItem(key)
}