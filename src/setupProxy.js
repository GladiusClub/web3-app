const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/proxyAvatar",
    createProxyMiddleware({
      target: "https://avataaars.io",
      changeOrigin: true,
      pathRewrite: {
        "^/proxyAvatar": "",
      },
    })
  );
};
