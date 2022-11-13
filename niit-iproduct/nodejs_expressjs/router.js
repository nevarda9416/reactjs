var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    res.send('Bạn đã truy cập địa chỉ bằng phương thức GET');
});
router.post('/', function(req, res) {
    res.send("Bạn đã truy cập địa chỉ bằng phương thức POST");
});
// Xuất bộ định tuyến này để có thể sử dụng ở file khác
module.exports = router;