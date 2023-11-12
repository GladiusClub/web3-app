const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/proxyAvatar",
    createProxyMiddleware({
      target: "https://us-central1-wallet-login-45c1c.cloudfunctions.net",
      changeOrigin: true,
      pathRewrite: {
        "^/proxyAvatar": "/openai_image_generate", // Rewrite path to target your specific function
      },
    })
  );
};
