var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', (req, res) => res.send('<h1>Request Object</h1>'))
/**
 * Có 3 cách để chúng ta nhận dữ liệu từ người dùng gửi về tùy theo từng trường hợp: req.params, req.query và req.body
 */
// req.params: /user/123
app.get('/user/:userId', (req, res) => {
    res.send('<h2>' + req.params.userId + '</h2>');
});
// req.query: /taken?userID=123&action=changeProfile
app.get('/taken', (req, res) => {
    res.send(req.query.userID + ' ' + req.query.action)
});
// req.body: /login {username: 'admin',  password: '1234'}
// Lấy giá trị của header
app.post('/login', function (req, res) {
    res.send(req.body.username + ' ' + req.body.password);
    console.log(req.header('Content-Type')); // application/json
    console.log(req.header('Content-Length')); // 38
    console.log(req.header('user-agent')); // PostmanRuntime/7.26.1
    console.log(req.header('Authorization')); // undefined
    console.log(req.cookies.isShowPopup); // undefined
    console.log(req.cookies.sessionID); // undefined
});
// Lấy các giá trị của URL: /search?keyword=nodejs
app.get('/search', (req, res) => {
    console.log(req.protocol); // http
    console.log(req.hostname); // localhost
    console.log(req.path); // search
    console.log(req.originalUrl); // search?keyword=nodejs
    console.log(req.subdomains); // []
});
app.listen(3000, '127.0.0.1', () => console.log('Example app listening on port 3000!'))