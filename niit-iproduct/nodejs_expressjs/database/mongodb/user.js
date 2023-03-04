const express = require('express');
const cors = require('cors');
const moment = require('moment');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const env = process.env;
const url = env.DATABASE_CONNECTION + '://' + env.DATABASE_HOST + ':' + env.DATABASE_PORT + '/';
const port = env.DATABASE_PORT_USER_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_USER_NAME;
const collection_system_name = env.COLLECTION_SYSTEM_NAME;
const collection_activity_name = env.COLLECTION_ACTIVITY_NAME;
const crypto = require('crypto');
const getHashedPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('base64');
};
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const generateAccessToken = (username) => {
  return jwt.sign(username, env.TOKEN_SECRET);
};
// https://stackabuse.com/handling-authentication-in-express-js/
app.post('/admin/login', (req, res) => {
  const {username, password} = req.body;
  const hashedPassword = getHashedPassword(password);
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db('niit-iproduct');
    dbo.collection('users').findOne({username: username, password: hashedPassword}, function (error, response) {
      if (error) throw error;
      console.log(response);
      res.jsonp({user: response});
      database.close();
    });
  });
});
app.get('/admin/logout', (req, res) => {
  const {username, password} = req.body;
  const hashedPassword = getHashedPassword(password);
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db('niit-iproduct');
    dbo.collection('users').findOne({username: username, password: hashedPassword}, function (error, response) {
      if (error) throw error;
      console.log(response);
      res.jsonp({user: response});
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
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    // Start write system log
    const user_id = req.body.user_id;
    dbo.collection(collection_system_name).findOne({type: req.body.system_type}, function (error, response) {
      if (error) throw error;
      if (response) {
        // created_by
        if (response.created_by === '1' || response.created_by === 1) {
          created_by = user_id;
        }
        // created_at
        if (response.created_at === '1' || response.created_at === 1) {
          created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // updated_by
        if (response.updated_by === '1' || response.updated_by === 1) {
          updated_by = user_id;
        }
        // updated_at
        if (response.updated_at === '1' || response.updated_at === 1) {
          updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_actived
        if (response.is_actived === '1' || response.is_actived === 1) {
          is_actived = 1;
        }
        // actived_by
        if (response.actived_by === '1' || response.actived_by === 1) {
          actived_by = user_id;
        }
        // actived_at
        if (response.actived_at === '1' || response.actived_at === 1) {
          actived_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_deleted
        if (response.is_deleted === '1' || response.is_deleted === 1) {
          is_deleted = 1;
        }
        // deleted_by
        if (response.deleted_by === '1' || response.deleted_by === 1) {
          deleted_by = user_id;
        }
        // deleted_at
        if (response.deleted_at === '1' || response.deleted_at === 1) {
          deleted_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_published
        if (response.is_published === '1' || response.is_published === 1) {
          is_published = 1;
        }
        // published_by
        if (response.published_by === '1' || response.published_by === 1) {
          published_by = user_id;
        }
        // published_at
        if (response.published_at === '1' || response.published_at === 1) {
          published_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        const listingQueryAction = {subject: 'Create user'};
        const updateActions = {
          $set: {
            subject: 'Create user',
            content: 'Create user: ' + req.body.username,
            url: '/users/add',
            method: 'POST',
            function: null,
            ip: null,
            agent: null,
            created_by: created_by,
            created_at: created_at,
            updated_by: updated_by,
            updated_at: updated_at
          }
        };
        // End write system log
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
            system_type: req.body.system_type,
            created_by: created_by,
            created_at: created_at,
            updated_by: updated_by,
            updated_at: updated_at,
            is_actived: is_actived,
            actived_by: actived_by,
            actived_at: actived_at,
            is_deleted: is_deleted,
            deleted_by: deleted_by,
            deleted_at: deleted_at,
            is_published: is_published,
            published_by: published_by,
            published_at: published_at
          }
        };
        dbo.collection(collection_activity_name).updateOne(listingQueryAction, updateActions, {upsert: true}, function (error, response) {
          if (error) throw error;
          console.log('Activity is created: ' + JSON.stringify(response));
        });
        dbo.collection(collection_name).updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
          if (error) throw error;
          console.log('Documents inserted or updated: ' + JSON.stringify(response));
          res.jsonp(response);
          database.close();
        });
      }
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
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    // Start write system log
    const user_id = req.body.user_id;
    dbo.collection(collection_system_name).findOne({type: req.body.system_type}, function (error, response) {
      if (error) throw error;
      if (response) {
        // created_by
        if (response.created_by === '1' || response.created_by === 1) {
          created_by = user_id;
        }
        // created_at
        if (response.created_at === '1' || response.created_at === 1) {
          created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // updated_by
        if (response.updated_by === '1' || response.updated_by === 1) {
          updated_by = user_id;
        }
        // updated_at
        if (response.updated_at === '1' || response.updated_at === 1) {
          updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_actived
        if (response.is_actived === '1' || response.is_actived === 1) {
          is_actived = 1;
        }
        // actived_by
        if (response.actived_by === '1' || response.actived_by === 1) {
          actived_by = user_id;
        }
        // actived_at
        if (response.actived_at === '1' || response.actived_at === 1) {
          actived_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_deleted
        if (response.is_deleted === '1' || response.is_deleted === 1) {
          is_deleted = 1;
        }
        // deleted_by
        if (response.deleted_by === '1' || response.deleted_by === 1) {
          deleted_by = user_id;
        }
        // deleted_at
        if (response.deleted_at === '1' || response.deleted_at === 1) {
          deleted_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_published
        if (response.is_published === '1' || response.is_published === 1) {
          is_published = 1;
        }
        // published_by
        if (response.published_by === '1' || response.published_by === 1) {
          published_by = user_id;
        }
        // published_at
        if (response.published_at === '1' || response.published_at === 1) {
          published_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        const listingQueryAction = {subject: 'Update user'};
        const updateActions = {
          $set: {
            subject: 'Update user',
            content: 'Update user: ' + req.body.username,
            url: '/users/edit/:id',
            method: 'POST',
            function: null,
            ip: null,
            agent: null,
            created_by: created_by,
            created_at: created_at,
            updated_by: updated_by,
            updated_at: updated_at
          }
        };
        // End write system log
        const listingQuery = {_id: new ObjectId(req.params.id)};
        console.log(req.body);
        const token = generateAccessToken({username: req.body.username});
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
            system_type: req.body.system_type,
            access_token: token,
            created_by: created_by,
            created_at: created_at,
            updated_by: updated_by,
            updated_at: updated_at,
            is_actived: is_actived,
            actived_by: actived_by,
            actived_at: actived_at,
            is_deleted: is_deleted,
            deleted_by: deleted_by,
            deleted_at: deleted_at,
            is_published: is_published,
            published_by: published_by,
            published_at: published_at
          }
        };
        dbo.collection(collection_activity_name).updateOne(listingQueryAction, updateActions, {upsert: true}, function (error, response) {
          if (error) throw error;
          console.log('Activity is created: ' + JSON.stringify(response));
        });
        dbo.collection(collection_name).updateOne(listingQuery, updates, {upsert: true}, function (error, response) {
          if (error) throw error;
          console.log('User updated: ' + JSON.stringify(response));
          res.jsonp(response);
          database.close();
        });
      }
    });
  });
});
// Delete user (POST)
app.post('/' + collection_name + '/delete/:id', function (req, res) {
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    // Start write system log
    const user_id = req.body.user_id;
    dbo.collection(collection_system_name).findOne({type: req.body.system_type}, function (error, response) {
      if (error) throw error;
      if (response) {
        // created_by
        if (response.created_by === '1' || response.created_by === 1) {
          created_by = user_id;
        }
        // created_at
        if (response.created_at === '1' || response.created_at === 1) {
          created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // updated_by
        if (response.updated_by === '1' || response.updated_by === 1) {
          updated_by = user_id;
        }
        // updated_at
        if (response.updated_at === '1' || response.updated_at === 1) {
          updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_actived
        if (response.is_actived === '1' || response.is_actived === 1) {
          is_actived = 1;
        }
        // actived_by
        if (response.actived_by === '1' || response.actived_by === 1) {
          actived_by = user_id;
        }
        // actived_at
        if (response.actived_at === '1' || response.actived_at === 1) {
          actived_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_deleted
        if (response.is_deleted === '1' || response.is_deleted === 1) {
          is_deleted = 1;
        }
        // deleted_by
        if (response.deleted_by === '1' || response.deleted_by === 1) {
          deleted_by = user_id;
        }
        // deleted_at
        if (response.deleted_at === '1' || response.deleted_at === 1) {
          deleted_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        // is_published
        if (response.is_published === '1' || response.is_published === 1) {
          is_published = 1;
        }
        // published_by
        if (response.published_by === '1' || response.published_by === 1) {
          published_by = user_id;
        }
        // published_at
        if (response.published_at === '1' || response.published_at === 1) {
          published_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        const listingQueryAction = {subject: 'Delete user'};
        const updateActions = {
          $set: {
            subject: 'Delete user',
            content: 'Delete user ID: ' + req.params.id,
            url: '/users/delete/:id',
            method: 'POST',
            function: null,
            ip: null,
            agent: null,
            created_by: created_by,
            created_at: created_at,
            updated_by: updated_by,
            updated_at: updated_at
          }
        };
        // End write system log
        const listingQuery = {_id: new ObjectId(req.params.id)};
        dbo.collection(collection_activity_name).updateOne(listingQueryAction, updateActions, {upsert: true}, function (error, response) {
          if (error) throw error;
          console.log('Activity is created: ' + JSON.stringify(response));
        });
        dbo.collection(collection_name).deleteOne(listingQuery, function (error, response) {
          if (error) throw error;
          console.log('User deleted');
          res.jsonp(response);
          database.close();
        });
      }
    });
  });
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('User service is listening on port ' + port + '!')
});
