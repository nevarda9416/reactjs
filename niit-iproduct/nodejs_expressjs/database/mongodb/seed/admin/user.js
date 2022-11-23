const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const crypto = require('crypto');
const { get } = require('https');
const getHashedPassword = (password) => {
    const hash = crypto.createHash('sha256').update(password).digest('base64');
    return hash;
}

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/users/create', function (req, res) {
    const listingQuery = { username: 'admin' };
    const listUsers = {
        $set: { username: 'admin', email: 'admin@gmail.com', fullname: 'Admin iProduct', password: getHashedPassword('admin') }
    };
    console.log(listUsers);
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        dbo.collection('users').updateOne(listingQuery, listUsers, { upsert: true }, function (error, response) {
            if (error) throw error;
            console.log('Documents inserted or updated: ' + JSON.stringify(response));
            res.jsonp(response);
        });
    })
})
// https://stackabuse.com/handling-authentication-in-express-js/
app.post('/admin/login', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = getHashedPassword(password);
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        dbo.collection('users').findOne({ username: username, password: hashedPassword }, function (error, response) {
            if (error) throw error;
            if (response) return response.username;
        });
    })
})
app.listen(3002, '127.0.0.1', function () {
    console.log('Example app listening on port 3002!')
})
