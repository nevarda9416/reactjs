const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../../.env')});
const env = process.env;
const url = env.DATABASE_CONNECTION + '://' + env.DATABASE_HOST + ':'+ env.DATABASE_PORT + '/';
const port = env.DATABASE_PORT_USER_SEEDING_DATA;
const dbname = env.DATABASE_NAME;
const collectname = env.COLLECTION_USER_NAME;
const crypto = require('crypto');
const getHashedPassword = (password) => {
    const hash = crypto.createHash('sha256').update(password).digest('base64');
    return hash;
};

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
});
app.listen(port, env.SERVER_NAME, function () {
    console.log('Example app listening on port ' + port + '!')
});
