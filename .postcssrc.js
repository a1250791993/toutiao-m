module.exports = {
    plugins: {
        // 配置使用的autoprefixer插件
        // 作用:生成游览器css样式规则前缀
        // vueCli内部已经配置了，不需要在配置了
        // 'autoprefixer': {  //autoprefixer插件的配置信息
        //     //配置要兼容到的环境信息
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },

        'postcss-pxtorem': {
            // lib-flexible 的 REM适配方案: 把一份分成十分，没份就是十分之一
            // 所以 rootValue 应该设置为你的设计稿的宽度的十分之一
            // 我们的设计稿是750/10 就是75
            // 但是，Vant建议设置为37.5 为什么?因为Vant是基于375写的
            // 所以必须设置为37.5 
            // 唯一的缺点是我们的设计稿的尺寸必须/2

            // 更好方法，查阅文档 rootValue支持两种类型： 数字，函数
            // postcss-pxtorem处理每个css文件都会调用这个方法,把处理css文件的相关信息通过参数传给这个函数
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },

            // rootValue: 37.5,

            // 配置要转换的css属性   * 表示所有属性
            propList: ['*'],

            //排除不要转换的样式资源
            exclude: 'github-markdown'
        }
    }
}