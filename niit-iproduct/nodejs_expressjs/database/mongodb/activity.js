const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
const { ObjectId } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const env = process.env;
const url = env.DATABASE_CONNECTION + '://' + env.DATABASE_HOST + ':' + env.DATABASE_PORT + '/';
const port = env.DATABASE_PORT_ACTIVITY_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_ACTIVITY_NAME;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Count data (GET)
app.get('/' + collection_name + '/count', function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection('products').count({}, function (error, response_p) {
      dbo.collection('categories').count({}, function (error, response_c) {
        dbo.collection('tags').count({}, function (error, response_t) {
          if (error) throw error;
          res.jsonp({ product: response_p, category: response_c, tag: response_t });
          database.close();
        });
      });
    });
  });
});
// Find activity name like input data (GET)
app.get('/' + collection_name + '/find', function (req, res) {
  const search_name = req.query.name;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({ name: new RegExp(search_name, 'i') }).toArray(function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
});
// List activitys (GET)
app.get('/' + collection_name, function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({}).sort({ _id: -1 }).toArray(function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
});
// Add activity (POST)
app.post('/' + collection_name + '/add', function (req, res) {
  console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
  console.log(req.body);
  const listingQuery = { subject: req.body.subject };
  const updates = {
    $set: {
      subject: req.body.subject,
      content: req.body.content,
      url: req.body.url,
      method: req.body.method,
      function: req.body.function,
      ip: req.body.ip,
      agent: req.body.agent,
      user_id: req.body.user_id,
      system_type: req.body.system_type
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
      if (error) throw error;
      console.log('Documents inserted or updated: ' + JSON.stringify(response));
      res.jsonp(response);
      database.close();
    });
  });
});
// Edit activity (GET)
app.get('/' + collection_name + '/edit/:id', function (req, res) {
  const _id = req.params.id;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).findOne({ _id: new ObjectId(_id) }, function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
});
// Update activity (POST)
app.post('/' + collection_name + '/edit/:id', function (req, res) {
  const listingQuery = { _id: new ObjectId(req.params.id) };
  console.log(req.body);
  const updates = {
    $set: {
      subject: req.body.subject,
      content: req.body.content,
      url: req.body.url,
      method: req.body.method,
      function: req.body.function,
      ip: req.body.ip,
      agent: req.body.agent,
      user_id: req.body.user_id,
      system_type: req.body.system_type
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
      if (error) throw error;
      console.log('Activity updated: ' + JSON.stringify(response));
      res.jsonp(response);
      database.close();
    });
  });
});
// Delete activity (GET)
app.get('/' + collection_name + '/delete/:id', function (req, res) {
  const listingQuery = { _id: new ObjectId(req.params.id) };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).deleteOne(listingQuery, function (error, response) {
      if (error) throw error;
      console.log('Activity deleted');
      res.jsonp(response);
      database.close();
    });
  });
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Example app listening on port ' + port + '!')
});
