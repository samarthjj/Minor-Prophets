// https://stackoverflow.com/questions/52845805/deploying-create-react-app-to-heroku-with-express-backend-returns-invalid-host-h/52846108#52846108
// https://stackoverflow.com/questions/49165232/reactjs-app-in-heroku-invalid-host-header-host-configuration?rq=1
// Heroku is having issues with the setup - debugging issues led here

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware('/api/**', { target: 'http://localhost:5000' }));
    app.use(createProxyMiddleware('/otherApi/**', { target: 'http://localhost:5000' }));
};