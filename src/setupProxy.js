/*
为解决跨域问题而设置的前端代理
这里是cjs
是在package里直接加的完整形式
 */
/*const proxy = require('http-proxy-middleware')

module.exports = function (app){
    app.use(
        proxy('/api1',{
            target:'http://localhost:8080',
            changeOrigin:true,
            pathRewrite:{'^/api1':''}
        })
    )
}*/

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathFilter: '/api1',
            pathRewrite: {'^/api1': ''}
        })
    );
};