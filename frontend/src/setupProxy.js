
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api/v3',
        createProxyMiddleware({
            target: 'https://app.fakturoid.cz/api/v3/',
            changeOrigin: true,
            on: {
                proxyReq: fixRequestBody
            }
        })
    );
};