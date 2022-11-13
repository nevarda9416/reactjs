// https://freetuts.net/tao-ung-dung-hello-world-bang-expressjs-1559.html
// Dòng code này được dùng khi bạn muốn import (nhập) một package nào đó trong node_modules, ở đây là package express
const express = require('express')
/** Dòng code kế tiếp, tạo ứng dụng bằng cách gọi hàm khởi tạo của express,
 * Hàm khởi tạo hay còn gọi là constructor, là một hàm phải được gọi đầu tiên nếu bạn muốn tạo một đối tượng nào đó. Để tiện sử dụng ta gán vào biến app.
 */
const app = express()
// Đoạn mã tiếp theo, khai báo nơi người dùng có thể truy cập tới và server sẽ phản hồi như thế nào
/**
 * Express ghi nhận router '/' phương thức GET và gọi vào hàm xử lý mà bạn cung cấp
 * Hàm xử lý sẽ nhận 2 đối tượng là req và res
 * + req được viết tắt từ request, chứa toàn bộ dữ liệu mà người dùng gửi lên webserver
 * + res được viết tắt từ response, chứa các hàm dùng để trả dữ liệu lại cho người dùng, bao gồm cả việc trả về HTML để hiển thị giao diện web
 */
app.get('/', (req, res) => res.send('<h1>Hello World!</h1>'))
// Đoạn code này sẽ liên kết và lắng nghe các kết nối tới địa chỉ và port chỉ định. Mặc định bạn chỉ cần nhập số của port thì ExpressJS sẽ tự liên kết tới địa chỉ localhost.
// Và mọi yêu cầu được gửi tới địa chỉ localhost qua cổng 3000 thì ExpressJS sẽ bắt lại và xử lý
app.listen(3000, '127.0.0.1', () => console.log('Example app listening on port 3000!'))
// 1. app.get(path, handler)
app.get('/hello', function(req, res) {
    res.send('Hello World!');
});
// 2. app.post(path, handler)
app.post("/hello", (req, res) => {
    res.send("Bạn vừa gửi yêu cầu bằng phương thức POST tới địa chỉ /hello");
});
/**
 * Nếu bạn cứ phải tự định nghĩa các định tuyến với các chức năng giống nhau thì rất mệt để bảo trì hoặc sửa đổi.
 * Ví dụ như ta có tính năng user thay vì phải tự khai báo lại là app.get('/user') và app.post('/user') thì ta cần chuyển qua sử dụng bộ định tuyến.
 */
var router = require('./router');
app.use('/user', router);
/**
 * Đường dẫn động
 * Dynamic URL sử dụng regular express patch và string paterns
 * Các ký tự như ?,+,* và () là các ký tự regular express hay được sử dụng. Ký tự ngạch ngang(-) và chấm (.) được mặc định là một string-based path
 * Route parameters: Các giái trị đã ghi vào đối tượng req.params, với key của tham số tuyến được chỉ định trong đường dẫn, và value là giá trị tương ứng của chúng.
 */
// Thêm pattern match cho router params
app.get('/members/:memberID([0-9]{2})', (req, res) => {
    res.send(req.params);
});
// Sử dụng string pattern trong path
// Route này sẽ có path là acd hoặc abcd
app.get('/ab?cd', (req, res) => {
    res.send('ab?cd');
});
// Route này sẽ có path là abcd, abbcd, abbbcd,vv...
app.get('/ab+cd', (req, res) => {
    res.send('ab+cd');
});
// Route này sẽ có path là abcd, abxcd, abRANDOMcd, ab123cd,vv...
app.get('/ab*cd', (req, res) => {
    res.send('ab*cd');
});
// Route này sẽ có path là /abe và /abcde
app.get('/ab(cd)?e', (req, res) => {
    res.send('ab(cd)?e');
});
// Regular expressions routes
// Chỉ match với kí tự a
app.get(/a/, (req, res) => {
    res.send('/a/');
});
// Match với số điện thoại
app.get('/phonenumbers/((09|03|07|08|05)+([0-9]{8}))', (req, res) => {
    res.send(req.params);
});