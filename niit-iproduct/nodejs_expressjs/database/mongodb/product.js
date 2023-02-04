const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
const { ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const env = process.env;
const url = env.DATABASE_CONNECTION + '://' + env.DATABASE_HOST + ':' + env.DATABASE_PORT + '/';
const port = env.DATABASE_PORT_PRODUCT_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_PRODUCT_NAME;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Find product name like input data (GET)
app.get('/' + collection_name + '/find', function (req, res) {
  const search_name = req.query.name;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({name: new RegExp(search_name, 'i')}).toArray(function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      setTimeout(() => {
        dbo.close()
      }, 3000);
    });
  })
});
// List products (GET)
app.get('/' + collection_name, function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({}).sort({_id: -1}).toArray(function (error, response) {
      if (error) throw error;
      if (response) {
        setTimeout(() => {
          dbo.close()
        }, 3000);
        res.jsonp(response);
      }
    });
  })
});
// Add product (POST)
app.post('/' + collection_name + '/add', function (req, res) {
  console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
  console.log(req.body);
  const listingQuery = {name: req.body.name};
  const updates = {
    $set: {
      category_id: req.body.category_id,
      name: req.body.name,
      short_description: req.body.short_description,
      full_description: req.body.full_description,
      unit: req.body.unit,
      currency: req.body.currency,
      price: req.body.price
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
// Edit product (GET)
app.get('/' + collection_name + '/edit/:id', function (req, res) {
  const _id = req.params.id;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).findOne({_id: new ObjectId(_id)}, function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      setTimeout(() => {
        database.close()
      }, 3000);
    });
  })
});
// Update product (POST)
app.post('/' + collection_name + '/edit/:id', function (req, res) {
  const listingQuery = {_id: new ObjectId(req.params.id)};
  console.log(req.body);
  const updates = {
    $set: {
      category_id: req.body.category_id,
      name: req.body.name,
      short_description: req.body.short_description,
      full_description: req.body.full_description,
      unit: req.body.unit,
      currency: req.body.currency,
      price: req.body.price
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
      if (error) throw error;
      console.log('Product updated: ' + JSON.stringify(response));
      res.jsonp(response);
    });
  })
});
// Delete product (GET)
app.get('/' + collection_name + '/delete/:id', function (req, res) {
  const listingQuery = {_id: new ObjectId(req.params.id)};
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).deleteOne(listingQuery, function (error, response) {
      if (error) throw error;
      console.log('Product deleted');
      res.jsonp(response);
      database.close();
    });
  })
});
// Export from database and write to json file
app.get('/products/export', function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection('products').find({}).sort({ _id: -1 }).toArray(function (error, response) {
      if (error) throw error;
      fs.writeFile('./nodejs_expressjs/database/mongodb/products.json', JSON.stringify(response), function (error) {
        if (error) {
          res.jsonp({ success: false });
        } else {
          console.log(JSON.stringify(response));
          res.jsonp({ success: true });
        }
      });
    });
  })
});
// Import from json file to database
app.get('/products/import', function (req, res) {
  fs.readFile('./nodejs_expressjs/database/mongodb/products.json', function(error, response) {
    if (error) {
      res.jsonp({ success: false });
    } else {
      const parseJSON = JSON.parse(response);
      parseJSON.forEach(element => {
        console.log(element.name);
        const listingQuery = {name: element.name};
        const updates = {
          $set: {
            category_id: element.category_id,
            name: element.name,
            short_description: element.short_description,
            full_description: element.full_description,
            unit: element.unit,
            currency: element.currency,
            price: element.price
          }
        };
        mongoClient.connect(url, function (error, database) {
          if (error) throw error;
          const dbo = database.db(dbname);
          dbo.collection('products').updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
            if (error) throw error;
            console.log('Documents inserted or updated: ' + JSON.stringify(response));
          });
        })
      });
      res.jsonp({ success: true });
    }
  })
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Example app listening on port ' + port + '!')
});
