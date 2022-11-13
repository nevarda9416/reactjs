const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

app.get('/', function (req, res) {
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        const myobj = [
            { name: 'Smartphones', description: 'Smartphones'},
            { name: 'Máy tính bảng', description: 'Máy tính bảng'},
            { name: 'Điện thoại phổ thông', description: 'Điện thoại phổ thông'},
          ];
        console.log('Database created!');
        dbo.collection('categories').insertMany(myobj, function (error, response) {
            if (error) throw error;
            console.log('Collection created! Number of documents inserted: ' + response.insertedCount);
        });
        setTimeout(() => {database.close()}, 3000);
    })
    res.send('Method: ' + req.method + '<h1>Hello MongoDB!</h1>')
})
app.listen(3000, '127.0.0.1', function () {
    console.log('Example app listening on port 3000!')
})
