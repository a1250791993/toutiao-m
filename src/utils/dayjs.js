/* 
时间处理包
 */
import Vue from 'vue'
import dayjs from 'dayjs'

// 下载中文包，因为默认是英文
import 'dayjs/locale/zh-cn'

//引入相对时间包
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置处理相对时间的插件
dayjs.extend(relativeTime)

dayjs.locale('zh-cn') // 全局使用

// 定义一个全局的过滤器，然后就可以在任何组件的模板中是使用了
// 其实过滤器就相当于一个全局可用的方法(仅供模板使用)
//参数1：过滤器名称
// 参数2：过滤器函数
// 使用方式：{{表达式|过滤器名称}}
// 管道符前面的表达式的结果会作为参数传递到过滤器的函数中
// 过滤器的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})