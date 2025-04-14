const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    // Add proxy configuration here if needed
    // For example:
    // app.use('/api', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
  };