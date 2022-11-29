const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const env = process.env;
const url = env.DATABASE_MONGO + '://' + env.HOST_DATABASE_MONGO + ':'+ env.PORT_DATABASE_MONGO + '/';
const port = env.PORT_DATABASE_MONGO_USER_CRUD_DATA;
const crypto = require('crypto');
const getHashedPassword = (password) => {
    const hash = crypto.createHash('sha256').update(password).digest('base64');
    return hash;
}

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// https://stackabuse.com/handling-authentication-in-express-js/
app.post('/admin/login', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = getHashedPassword(password);
    mongoClient.connect(url, function (error, database) {
        if (error) throw error;
        const dbo = database.db('niit-iproduct');
        dbo.collection('users').findOne({ username: username, password: hashedPassword }, function (error, response) {
            if (error) throw error;
            if (response !== null) {
                res.jsonp({user:true});
            }
        });
    })
})
app.listen(port, env.SERVER_NAME, function () {
    console.log('Example app listening on port ' + port + '!')
})