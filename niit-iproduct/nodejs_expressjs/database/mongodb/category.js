const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

app.get('/', function (req, res) {
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        const myobj = [
            { name: 'Smartphones', dbname: 'smartphones', description: 'Smartphones' },
            { name: 'Máy tính bảng', dbname: 'maytinhbang', description: 'Máy tính bảng' },
            { name: 'Điện thoại phổ thông', dbname: 'dienthoaiphothong', description: 'Điện thoại phổ thông' },
        ];
        console.log('Database created!');
        myobj.forEach((item) => {
            dbo.collection('categories').updateOne({ dbname: item.dbname }, { $set: item }, { upsert: true }, function (error, response) {
                if (error) throw error;
                console.log('Collection created! Documents inserted or updated: ' + item.name);
            });
        });
        dbo.collection('categories').findOne({ dbname: 'dienthoaiphothong' }, function (error, response) {
            if (error) throw error;
            console.log('Category name: ' + response.name);
            if (response.name !== '')
                setTimeout(() => { database.close() }, 3000);
        });
    })
    res.send('Method: ' + req.method + '<h1>Hello MongoDB!</h1>')
})
app.listen(3000, '127.0.0.1', function () {
    console.log('Example app listening on port 3000!')
})
