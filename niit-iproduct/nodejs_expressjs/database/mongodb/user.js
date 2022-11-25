const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
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
            if (response.username != '') {
                res.jsonp({user:true});
            }
        });
    })
})
app.listen(3001, '127.0.0.1', function () {
    console.log('Example app listening on port 3001!')
})