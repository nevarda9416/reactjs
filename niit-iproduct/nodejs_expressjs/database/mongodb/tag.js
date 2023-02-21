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
const port = env.DATABASE_PORT_TAG_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_TAG_NAME;
const collection_auth_name = env.COLLECTION_USER_NAME;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Find tag name like input data (GET)
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
// List tags (GET)
app.get('/' + collection_name, function (req, res) {
  const limitDocuments = typeof req.query.limit !== 'undefined' ? req.query.limit : 0;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({}).sort({ _id: -1 }).limit(parseInt(limitDocuments)).toArray(function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
});
// Add tag (POST)
app.post('/' + collection_name + '/add', function (req, res) {
  console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
  console.log(req.body);
  const listingQuery = { dbname: req.body.name };
  const updates = {
    $set: {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      user_id: req.body.user_id,
      system_type: req.body.system_type
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
      if (error) throw error;
      console.log('Tag is inserted or updated: ' + JSON.stringify(response));
      res.jsonp(response);
      database.close();
    });
  });
});
// Edit tag (GET)
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
// Update tag (POST)
app.post('/' + collection_name + '/edit/:id', function (req, res) {
  const listingQuery = { _id: new ObjectId(req.params.id) };
  console.log(req.body);
  const updates = {
    $set: {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      user_id: req.body.user_id,
      system_type: req.body.system_type
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
      if (error) throw error;
      console.log('Tag is updated: ' + JSON.stringify(response));
      res.jsonp(response);
      database.close();
    });
  });
});
// Delete tag (GET)
app.post('/' + collection_name + '/delete/:id', function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_auth_name).find({
      _id: new ObjectId(req.body.user_id),
      access_token: req.headers.authorization.split(' ')[1]
    }).toArray(function (error, response) {
      console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
      if (error) {
        throw error;
      } else {
        if (response.length) {
          const listingQuery = { _id: new ObjectId(req.params.id) };
          mongoClient.connect(url, function (error, database) {
            if (error) throw error;
            const dbo = database.db(dbname);
            dbo.collection(collection_name).deleteOne(listingQuery, function (error, response) {
              if (error) throw error;
              console.log('Tag is deleted!');
              res.jsonp(response);
              database.close();
            });
          });
        }
      }
    });
  });
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Tag service is listening on port ' + port + '!')
});
