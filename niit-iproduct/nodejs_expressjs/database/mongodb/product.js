const express = require('express');
const cors = require('cors');
const moment = require('moment');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const cheerio = require('cheerio'); // khai báo module cheerio
const request = require('request-promise'); // khai báo module request-promise
const path = require('path');
const { ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const env = process.env;
const url = env.DATABASE_CONNECTION + '://' + env.DATABASE_HOST + ':' + env.DATABASE_PORT + '/';
const port = env.DATABASE_PORT_PRODUCT_CRUD_DATA;
const dbname = env.DATABASE_NAME;
const collection_name = env.COLLECTION_PRODUCT_NAME;
const collection_auth_name = env.COLLECTION_USER_NAME;
const collection_system_name = env.COLLECTION_SYSTEM_NAME;
const collection_activity_name = env.COLLECTION_ACTIVITY_NAME;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Find product name like input data (GET)
app.get('/' + collection_name + '/find', function (req, res) {
  const search_name = req.query.name;
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection(collection_name).find({ name: new RegExp(search_name, 'i') }).sort({ price: 1 }).toArray(function (error, response) {
      if (error) throw error;
      res.jsonp(response);
      database.close();
    });
  });
});
// List products (GET)
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
// Add product (POST)
app.post('/' + collection_name + '/add', function (req, res) {
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
          // Start write system log
          const user_id = req.body.user_id;
          dbo.collection(collection_system_name).findOne({ type: req.body.system_type }, function (error, response) {
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
              const listingQueryAction = { subject: 'Update category' };
              const updateActions = {
                $set: {
                  subject: 'Create product',
                  content: 'Create product: ' + req.body.name,
                  url: '/products/add',
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
              const listingQuery = { name: req.body.name };
              const updates = {
                $set: {
                  category_id: req.body.category_id,
                  name: req.body.name,
                  short_description: req.body.short_description,
                  full_description: req.body.full_description,
                  unit: req.body.unit,
                  currency: req.body.currency,
                  price: req.body.price,
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
              mongoClient.connect(url, function (error, database) {
                if (error) throw error;
                const dbo = database.db(dbname);
                dbo.collection(collection_activity_name).updateOne(listingQueryAction, updateActions, {upsert: true}, function (error, response) {
                  if (error) throw error;
                  console.log('Activity is created: ' + JSON.stringify(response));
                });
                dbo.collection(collection_name).updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
                  if (error) throw error;
                  console.log('Product is inserted or updated: ' + JSON.stringify(response));
                  res.jsonp(response);
                  database.close();
                });
              });
            }
          });
        }
      }
    });
  });
});
// Edit product (GET)
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
// Update product (POST)
app.post('/' + collection_name + '/edit/:id', function (req, res) {
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
          // Start write system log
          const user_id = req.body.user_id;
          dbo.collection(collection_system_name).findOne({ type: req.body.system_type }, function (error, response) {
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
              const listingQueryAction = { subject: 'Update category' };
              const updateActions = {
                $set: {
                  subject: 'Update product',
                  content: 'Update product: ' + req.body.name,
                  url: '/products/edit/:id',
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
              const listingQuery = { _id: new ObjectId(req.params.id) };
              console.log(req.body);
              const updates = {
                $set: {
                  category_id: req.body.category_id,
                  name: req.body.name,
                  short_description: req.body.short_description,
                  full_description: req.body.full_description,
                  unit: req.body.unit,
                  currency: req.body.currency,
                  price: req.body.price,
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
              mongoClient.connect(url, function (error, database) {
                if (error) throw error;
                const dbo = database.db(dbname);
                dbo.collection(collection_activity_name).updateOne(listingQueryAction, updateActions, {upsert: true}, function (error, response) {
                  if (error) throw error;
                  console.log('Activity is created: ' + JSON.stringify(response));
                });
                dbo.collection(collection_name).updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
                  if (error) throw error;
                  console.log('Product is updated: ' + JSON.stringify(response));
                  res.jsonp(response);
                  database.close();
                });
              });
            }
          });
        }
      }
    });
  });
});
// Delete product (POST)
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
              const listingQueryAction = {subject: 'Update category'};
              const updateActions = {
                $set: {
                  subject: 'Delete product',
                  content: 'Delete product ID: ' + req.params.id,
                  url: '/products/delete/:id',
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
          const listingQuery = { _id: new ObjectId(req.params.id) };
          mongoClient.connect(url, function (error, database) {
            if (error) throw error;
            const dbo = database.db(dbname);
            dbo.collection(collection_activity_name).updateOne(listingQueryAction, updateActions, {upsert: true}, function (error, response) {
              if (error) throw error;
              console.log('Activity is created: ' + JSON.stringify(response));
            });
            dbo.collection(collection_name).deleteOne(listingQuery, function (error, response) {
              if (error) throw error;
              console.log('Product is deleted!');
              res.jsonp(response);
              database.close();
            });
          });
        }
      });
    }
  }
});
});
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
      database.close();
    });
  });
});
// Import from json file to database
app.get('/products/import', function (req, res) {
  fs.readFile('./nodejs_expressjs/database/mongodb/products.json', function (error, response) {
    if (error) {
      res.jsonp({ success: false });
    } else {
      const parseJSON = JSON.parse(response);
      parseJSON.forEach(element => {
        console.log(element.name);
        const listingQuery = { name: element.name };
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
          dbo.collection('products').updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
            if (error) throw error;
            console.log('Product is inserted or updated: ' + JSON.stringify(response));
            database.close();
          });
        })
      });
      res.jsonp({ success: true });
    }
  });
});
// Crawl list sample product (POST) | https://viblo.asia/p/lay-du-lieu-trang-web-trong-phut-mot-su-dung-nodejs-va-cheerio-yMnKMjPmZ7P
app.post('/' + collection_name + '/crawl/detail', function (req, res) {
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
          dbo.collection(collection_name).find().toArray(function (error, response) {
            if (error) throw error;
            response.forEach(element => {
              if (typeof element.link !== 'undefined') {
                console.log(element.link);
                request(element.link, (error, response_two, html) => {
                  if (!error && response_two.statusCode === 200) {
                    const $ = cheerio.load(html); // Load HTML
                    $('.wrap-product').each((index, el) => {
                      const listingQuery = { link: element.link };
                      const listProducts = {
                        $set: {
                          short_description: $(el).find('.pdetail-desc').html(),
                          full_description: $(el).find('.pd-content-seemore').html(),
                          tag: null,
                          is_combo: 0,
                          category_id: null,
                          manufacture_id: null,
                          display_order: 0,
                          attribute_id: null,
                          seo_id: null,
                          user_id: req.body.user_id,
                          system_type: req.body.system_type
                        }
                      };
                      mongoClient.connect(url, function (error, database) {
                        if (error) throw error;
                        const dbo = database.db(dbname);
                        dbo.collection('products').updateOne(listingQuery, listProducts, function (error, response) {
                          if (error) throw error;
                          console.log('Product is inserted or updated: ' + JSON.stringify(response));
                          database.close();
                        });
                      });
                    })
                  } else {
                    console.log(error);
                  }
                });
              }
            });
            res.jsonp({ success: true });
          });
        }
      }
    });
  });
});
app.post('/' + collection_name + '/crawl/list', function (req, res) {
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
          const name = req.body.name;
          console.log(req.body);
          // Insert new tag
          app.post('/tags/add', function (req, res) {
            console.log('Bearer token: ' + req.headers.authorization.split(' ')[1]);
            const listingQuery = { name: name };
            const updates = {
              $set: {
                name: name,
                slug: null,
                description: null
              }
            };
            mongoClient.connect(url, function (error, database) {
              if (error) throw error;
              const dbo = database.db(dbname);
              dbo.collection('tags').updateOne(listingQuery, updates, { upsert: true }, function (error, response) {
                if (error) throw error;
                console.log('Tag is inserted or updated: ' + JSON.stringify(response));
                res.jsonp(response);
                database.close();
              });
            });
          });
          // Mediamart
          request('https://mediamart.vn/tag?key=' + name, (error, response, html) => {
            if (!error && response.statusCode === 200) {
              const $ = cheerio.load(html); // Load HTML
              $('.product-item').each((index, el) => {
                const listingQuery = { link: $(el).attr('href') };
                const price_saving = $(el).find('.product-price-saving').text().replace(/[^0-9]/g, '');
                const price_regular = $(el).find('.product-price-regular').text().replace(/[^0-9]/g, '');
                const price = price_regular - (price_regular / 100 * price_saving);
                console.log($(el).find('.product-name').text().replace(/\n/g, ''));
                const listProducts = {
                  $set: {
                    name: $(el).find('.product-name').text().replace(/\n/g, ''),
                    short_description: null,
                    full_description: null,
                    thumbnail_url: $(el).find('img').attr('src'),
                    link: 'https://mediamart.vn' + $(el).attr('href'),
                    unit: 'chiếc',
                    status: 'Còn hàng',
                    tag: null,
                    is_combo: 0,
                    category_id: null,
                    manufacture_id: null,
                    display_order: 0,
                    attribute_id: null,
                    seo_id: null,
                    user_id: req.body.user_id,
                    system_type: req.body.system_type,
                    currency: 'VND',
                    price: price
                  }
                };
                mongoClient.connect(url, function (error, database) {
                  if (error) throw error;
                  const dbo = database.db(dbname);
                  dbo.collection('products').updateOne(listingQuery, listProducts, { upsert: true }, function (error, response) {
                    if (error) throw error;
                    console.log('Product is inserted or updated: ' + JSON.stringify(response));
                    database.close();
                  });
                });
              })
            } else {
              console.log(error);
            }
          });
        }
      }
    });
  });
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Product service is listening on port ' + port + '!')
});
