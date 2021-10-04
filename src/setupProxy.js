// https://stackoverflow.com/questions/52845805/deploying-create-react-app-to-heroku-with-express-backend-returns-invalid-host-h/52846108#52846108
// https://stackoverflow.com/questions/49165232/reactjs-app-in-heroku-invalid-host-header-host-configuration?rq=1
// Heroku is having issues with the setup - debugging issues led here

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware('/api/**', { target: 'http://localhost:5000' }));
    app.use(createProxyMiddleware('/otherApi/**', { target: 'http://localhost:5000' }));
};

// https://www.npmjs.com/package/http-proxy-middleware
// This package stopped the issue that Heroku was picking up with "invalid header host."
// I believe it was because Heroku/Production environment doesn't like the "proxy" header in the 'package.json'
// and throws errors when it's there. So, this solution is used to take care of the proxy issues.