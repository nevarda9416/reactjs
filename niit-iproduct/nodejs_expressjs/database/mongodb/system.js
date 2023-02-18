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
const port = env.DATABASE_PORT_SYSTEM_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_SYSTEM_NAME;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Find system name like input data (GET)
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
// List systems (GET)
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
// Add system (POST)
app.post('/' + collection_name + '/add', function (req, res) {
  console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
  console.log(req.body);
  const listingQuery = {type: req.body.type};
  const updates = {
    $set: {
      type: req.body.type,
      is_actived: req.body.is_actived,
      actived_by: req.body.actived_by,
      actived_at: req.body.actived_at,
      created_by: req.body.created_by,
      created_at: req.body.created_at,
      updated_by: req.body.updated_by,
      updated_at: req.body.updated_at,
      is_deleted: req.body.is_deleted,
      deleted_by: req.body.deleted_by,
      deleted_at: req.body.deleted_at,
      is_published: req.body.is_published,
      published_by: req.body.published_by,
      published_at: req.body.published_at,
      user_id: req.body.user_id
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
// Edit system (GET)
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
// Update system (POST)
app.post('/' + collection_name + '/edit/:id', function (req, res) {
  const listingQuery = {_id: new ObjectId(req.params.id)};
  console.log(req.body);
  const updates = {
    $set: {
      type: req.body.type,
      is_actived: req.body.is_actived,
      actived_by: req.body.actived_by,
      actived_at: req.body.actived_at,
      created_by: req.body.created_by,
      created_at: req.body.created_at,
      updated_by: req.body.updated_by,
      updated_at: req.body.updated_at,
      is_deleted: req.body.is_deleted,
      deleted_by: req.body.deleted_by,
      deleted_at: req.body.deleted_at,
      is_published: req.body.is_published,
      published_by: req.body.published_by,
      published_at: req.body.published_at,
      user_id: req.body.user_id
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
      if (error) throw error;
      console.log('System updated: ' + JSON.stringify(response));
      res.jsonp(response);
      database.close();
    });
  });
});
// Delete system (GET)
app.get('/' + collection_name + '/delete/:id', function (req, res) {
  const listingQuery = {_id: new ObjectId(req.params.id)};
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).deleteOne(listingQuery, function (error, response) {
      if (error) throw error;
      console.log('System deleted');
      res.jsonp(response);
      database.close();
    });
  });
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Example app listening on port ' + port + '!')
});
