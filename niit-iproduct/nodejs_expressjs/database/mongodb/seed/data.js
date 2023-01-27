const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});
const env = process.env;
const url = env.DATABASE_CONNECTION + '://' + env.DATABASE_HOST + ':' + env.DATABASE_PORT + '/';
const port = env.DATABASE_PORT_SEEDING_DATA;
const dbname = env.DATABASE_NAME;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get('/data/create', function (req, res) {
  // 1) List sample categories
  const listCategories = [
    {name: 'Smartphones', dbname: 'smartphones', description: 'Smartphones'},
    {name: 'Máy tính bảng', dbname: 'maytinhbang', description: 'Máy tính bảng'},
    {name: 'Điện thoại', dbname: 'dienthoai', description: 'Điện thoại'},
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listCategories.forEach(value => {
      var listingQuery = {name: value.name};
      var category = {
        $set: {
          name: value.name,
          dbname: value.dbname,
          description: value.description
        }
      };
      dbo.collection('categories').updateOne(listingQuery, category, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 2) List sample products
  const listingQuery = {name: 'mac air m1'};
  const listProducts = {
    $set: {
      name: 'mac air m1',
      short_description: 'Phù hợp cho lập trình viên, thiết kế đồ họa 2D, dân văn phòng',
      full_description: 'Hiệu năng vượt trội - Cân mọi tác vụ từ word, exel đến chỉnh sửa ảnh trên các phần mềm như AI, PTS',
      thumbnail_url: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/m/a/macbook_air_22.png',
      unit: 'chiếc',
      status: 'Còn hàng',
      tag: 'Macbook Air 2020 M1, Macbook Air M1, Macbook Air M1 2020',
      is_combo: 0,
      category_id: null,
      manufacture_id: null,
      display_order: 1,
      attribute_id: null,
      seo_id: null,
      system_id: null,
      currency: 'VND',
      price: '33490000'
    }
  };
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    dbo.collection('products').updateOne(listingQuery, listProducts, {upsert: true}, function (error, response) {
      if (error) throw error;
      console.log('Documents inserted or updated: ' + JSON.stringify(response));
    });
  });
  // 3) List sample tags
  const listTags = [
    {name: 'Macbook Air 2020 M1', slug: 'macbook-air-2020-m1', description: 'Macbook Air 2020 M1', seo_id: null, system_id: null, is_google_trend: 'no'},
    {name: 'Macbook Air M1', slug: 'macbook-air-m1', description: 'Macbook Air M1', seo_id: null, system_id: null, is_google_trend: 'no'},
    {name: 'Macbook Air M1 2020', slug: 'macbook-air-m1-2020', description: 'Macbook Air M1 2020', seo_id: null, system_id: null, is_google_trend: 'no'}
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listTags.forEach(value => {
      var listingQuery = {name: value.name};
      var tag = {
        $set: {
          name: value.name,
          slug: value.slug,
          description: value.description,
          seo_id: value.seo_id,
          system_id: value.system_id,
          is_google_trend: value.is_google_trend
        }
      };
      dbo.collection('tags').updateOne(listingQuery, tag, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 4) List sample customers
  const listCustomers = [
    {
      username: 'tutest01',
      email: 'tutest01@gmail.com',
      telephone: '0987654321',
      fullname: 'DAO TIEN TU',
      password: '0987654321',
      gender: 'male',
      date_of_birth: '28/01/1992',
      status: 1, // 1: active, 0: inactive
      system_id: null,
      traffic_id: null
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listCustomers.forEach(value => {
      var listingQuery = {username: value.username};
      var customer = {
        $set: {
          username: value.username,
          email: value.email,
          telephone: value.telephone,
          fullname: value.fullname,
          password: value.password,
          gender: value.gender,
          date_of_birth: value.date_of_birth,
          status: value.status,
          system_id: value.system_id,
          traffic_id: value.traffic_id,
        }
      };
      dbo.collection('customers').updateOne(listingQuery, customer, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 5) List sample tracking
  const listTrackings = [
    {
      customer_id: null,
      datetime: '2022-12-17 23:59:59',
      keyword: 'iphone 14',
      action: 'search',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
      http_referrer: 'https://google.com',
      ip: '127.0.0.1',
      network_id: null,
      os: 'Windows',
      browser: 'Chrome',
      browser_version: '108.0.5359.124',
      device_type: 'PC',
      source: 'WEB',
      redirect_to_url: null,
      http_accept_language: 'fr-CH, fr;q=0.9, en;q=0.8, vi;q=0.7, *;q=0.5',
      http_accept_encoding: 'gzip',
      http_accept: 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8',
      http_host: 'developer.mozilla.org',
      server_address: '2600:9000:2369:ec00:2:eb5:8c00:93a1',
      country: 'England',
      city: 'London'
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listTrackings.forEach(value => {
      var listingQuery = {customer_id: value.customer_id};
      var tracking = {
        $set: {
          customer_id: value.customer_id,
          datetime: value.datetime,
          keyword: value.keyword,
          action: value.action,
          user_agent: value.user_agent,
          http_referrer: value.http_referrer,
          ip: value.ip,
          network_id: value.network_id,
          os: value.os,
          browser: value.browser,
          browser_version: value.browser_version,
          device_type: value.device_type,
          source: value.source,
          redirect_to_url: value.redirect_to_url,
          http_accept_language: value.http_accept_language,
          http_accept_encoding: value.http_accept_encoding,
          http_accept: value.http_accept,
          http_host: value.http_host,
          server_address: value.server_address,
          country: value.country,
          city: value.city
        }
      };
      dbo.collection('tracking').updateOne(listingQuery, tracking, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 6) List sample traffic sources
  const listTrafficSources = [
    {
      register_source: 'WEB',
      source_id: null,
      customer_id: null
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listTrafficSources.forEach(value => {
      var listingQuery = {register_source: value.register_source};
      var traffic_source = {
        $set: {
          register_source: value.register_source,
          source_id: value.source_id,
          customer_id: value.customer_id
        }
      };
      dbo.collection('traffic_sources').updateOne(listingQuery, traffic_source, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 7) List sample users (admin)
  const crypto = require('crypto');
  const getHashedPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('base64');
  };
  const listUsers = [
    {
      fullname: 'DAO TIEN TU',
      email: 'tudt@gmail.com',
      username: 'tudt',
      password: getHashedPassword('tudt@'),
      remember_token: null,
      refresh_token: null,
      department: 'IT',
      system_id: null
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listUsers.forEach(value => {
      var listingQuery = {email: value.email};
      var user = {
        $set: {
          fullname: value.fullname,
          email: value.email,
          username: value.username,
          password: value.password,
          remember_token: value.remember_token,
          refresh_token: value.refresh_token,
          department: value.department,
          system_id: value.system_id
        }
      };
      dbo.collection('users').updateOne(listingQuery, user, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 8) List sample activities
  const listActivites = [
    {
      subject: 'Create category',
      content: 'Create category: mobile',
      url: '/categories/add',
      method: 'POST',
      function: null,
      ip: '127.0.0.1',
      agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
      user_id: null,
      system_id: null
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listActivites.forEach(value => {
      var listingQuery = {subject: value.subject};
      var activity = {
        $set: {
          subject: value.subject,
          content: value.content,
          url: value.url,
          method: value.method,
          function: value.function,
          ip: value.ip,
          agent: value.agent,
          user_id: value.user_id,
          system_id: value.system_id
        }
      };
      dbo.collection('activities').updateOne(listingQuery, activity, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 9) List sample systems
  const listSystems = [
    {
      type: 'default',
      is_actived: 1, // 1: yes, 0: no
      actived_by: 'tudt',
      actived_at: '2022-12-17 01:02:55',
      created_by: 'tudt',
      created_at: '2022-12-17 01:03:55',
      updated_by: 'tudt',
      updated_at: '2022-12-17 01:04:55',
      is_deleted: 0, // 1: yes, 0: no
      deleted_by: null,
      deleted_at: null,
      is_published: 0, // 1: yes, 0: no
      published_by: null,
      published_at: null
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listSystems.forEach(value => {
      var listingQuery = {created_by: value.created_by};
      var system = {
        $set: {
          type: value.type, // NEW attribute
          is_actived: value.is_actived,
          actived_by: value.actived_by,
          actived_at: value.actived_at,
          created_by: value.created_by,
          created_at: value.created_at,
          updated_by: value.updated_by,
          updated_at: value.updated_at,
          is_deleted: value.is_deleted,
          deleted_by: value.deleted_by,
          deleted_at: value.deleted_at,
          is_published: value.is_published,
          published_by: value.published_by,
          published_at: value.published_at
        }
      };
      dbo.collection('systems').updateOne(listingQuery, system, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 10) List sample seo
  const listSeo = [
    {
      meta_title: 'Apple MacBook Air M1 16GB 512GB 2020 I Chính hãng Apple Việt Nam',
      meta_keyword: 'Macbook Air 2020 M1 16GB 512GB',
      meta_description: 'Mua ngay Macbook Air 2020 M1 16GB 512GB chính hãng VN/A giá rẻ - Hỗ trợ trả góp 0%, đổi mới 30 ngày, bảo hành chính hãng, giao hàng tận nơi miễn phí',
      system_id: null,
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listSeo.forEach(value => {
      var listingQuery = {meta_title: value.meta_title};
      var seo = {
        $set: {
          meta_title: value.meta_title,
          meta_keyword: value.meta_keyword,
          meta_description: value.meta_description,
          system_id: value.system_id
        }
      };
      dbo.collection('seo').insertMany(listSeo, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  // 11) List sample comments
  const listComments = [
    {
      customer_id: null,
      content: 'Sản phẩm giá quá cao',
      status: 1, // 1: show, 0: hide
      rate: 2,
      system_id: null
    }
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db(dbname);
    listComments.forEach(value => {
      var listingQuery = {customer_id: value.customer_id};
      var comment = {
        $set: {
          customer_id: value.customer_id,
          content: value.content,
          status: value.status,
          rate: value.rate,
          system_id: value.system_id
        }
      };
      dbo.collection('comments').insertMany(listComments, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
      });
    });
  });
  res.jsonp({success: true});
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Example app listening on port ' + port + '!')
});
