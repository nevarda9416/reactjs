const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const env = process.env;
const url = env.DATABASE_CONNECTION + '://' + env.DATABASE_HOST + ':'+ env.DATABASE_PORT + '/';
const port = env.DATABASE_PORT_USER_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_USER_NAME;
const crypto = require('crypto');
const getHashedPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('base64');
};
app.use(cors());
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
            console.log(response);
            res.jsonp({user:response});
            database.close();
        });
    });
});
// Find user name like input data (GET)
app.get('/' + collection_name + '/find', function (req, res) {
  const search_name = req.query.name;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({name: new RegExp(search_name, 'i')}).toArray(function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
});
// List users (GET)
app.get('/' + collection_name, function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({}).sort({_id: -1}).toArray(function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
});
// Add user (POST)
app.post('/' + collection_name + '/add', function (req, res) {
  console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
  console.log(req.body);
  const listingQuery = {username: req.body.username};
  const updates = {
    $set: {
      fullname: req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      remember_token: req.body.remember_token,
      refresh_token: req.body.refresh_token,
      department: req.body.department,
      user_id: req.body.user_id,
      system_type: req.body.system_type
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
      if (error) throw error;
      console.log('Documents inserted or updated: ' + JSON.stringify(response));
      res.jsonp(response);
      database.close();
    });
  });
});
// Edit user (GET)
app.get('/' + collection_name + '/edit/:id', function (req, res) {
  const _id = req.params.id;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).findOne({_id: new ObjectId(_id)}, function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
}); 
// Update user (POST)
app.post('/' + collection_name + '/edit/:id', function (req, res) {
  const listingQuery = {_id: new ObjectId(req.params.id)};
  console.log(req.body);
  const updates = {
    $set: {
      fullname: req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      remember_token: req.body.remember_token,
      refresh_token: req.body.refresh_token,
      department: req.body.department,
      user_id: req.body.user_id,
      system_type: req.body.system_type
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
      if (error) throw error;
      console.log('User updated: ' + JSON.stringify(response));
      res.jsonp(response);
      database.close();
    });
  });
});
// Delete user (GET)
app.get('/' + collection_name + '/delete/:id', function (req, res) {
  const listingQuery = {_id: new ObjectId(req.params.id)};
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).deleteOne(listingQuery, function (error, response) {
      if (error) throw error;
      console.log('User deleted');
      res.jsonp(response);
      database.close();
    });
  });
});
app.listen(port, env.SERVER_NAME, function () {
    console.log('Example app listening on port ' + port + '!')
});
