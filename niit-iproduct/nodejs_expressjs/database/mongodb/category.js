const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const env = process.env;
const url = env.DATABASE_MONGO + '://' + env.HOST_DATABASE_MONGO + ':'+ env.PORT_DATABASE_MONGO + '/';
const port = env.PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/categories', function (req, res) {
    const myobj = [
        { name: 'Smartphones', dbname: 'smartphones', description: 'Smartphones' },
        { name: 'Máy tính bảng', dbname: 'maytinhbang', description: 'Máy tính bảng' },
        { name: 'Điện thoại phổ thông', dbname: 'dienthoaiphothong', description: 'Điện thoại phổ thông' },
    ];
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        console.log('Database created!');
        dbo.collection('categories').findOne({ dbname: 'dienthoaiphothong' }, function (error, response) {
            if (error) throw error;
            if (response) console.log('Category name: ' + response.name);
        });
        dbo.collection('categories').find({}).toArray(function (error, response) {
            if (error) throw error;
            if (response) {
                setTimeout(() => { database.close() }, 3000);
                res.jsonp(response);
            }
        });
    })
    //res.send('Method: ' + req.method + '<h1>Hello MongoDB!</h1>')
})
app.post('/categories/add', function (req, res) {
    console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
    console.log(req.body);
    const listingQuery = { dbname: req.body.dbname };
    const updates = {
        $set: {
            name: req.body.name,
            dbname: req.body.dbname,
            description: req.body.description,
        }
    };
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        dbo.collection('categories').updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
            if (error) throw error;
            console.log('Documents inserted or updated: ' + JSON.stringify(response));
            res.jsonp(response);
        });
    })
})
app.get('/categories/edit/:id', function (req, res) {
    const _id = req.id;
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        dbo.collection('categories').findOne({ _id: _id }, function (error, response) {
            if (error) throw error;
            if (response) {
                setTimeout(() => { database.close() }, 3000);
                res.jsonp(response);
            }
        });
    })
})
app.listen(port, env.SERVER_NAME, function () {
    console.log('Example app listening on port ' + port + '!')
})
