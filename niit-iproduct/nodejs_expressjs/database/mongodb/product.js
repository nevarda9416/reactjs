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
const port = env.DATABASE_PORT_PRODUCT_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_PRODUCT_NAME;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// List products
app.get('/products', function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({}).sort({_id: -1}).toArray(function (error, response) {
      if (error) throw error;
      if (response) {
        setTimeout(() => {
          database.close()
        }, 3000);
        res.jsonp(response);
      }
    });
  })
});
// Add product
app.post('/products/add', function (req, res) {
  console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
  console.log(req.body);
  const listingQuery = {dbname: req.body.dbname};
  const updates = {
    $set: {
      name: req.body.name,
      dbname: req.body.dbname,
      description: req.body.description,
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
      if (error) throw error;
      console.log('Documents inserted or updated: ' + JSON.stringify(response));
      res.jsonp(response);
    });
  })
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Example app listening on port ' + port + '!')
});
