const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});
const env = process.env;
const url = env.DATABASE_MONGO + '://' + env.HOST_DATABASE_MONGO + ':' + env.PORT_DATABASE_MONGO + '/';
const port = env.PORT_DATABASE_MONGO_USER_SEEDING_DATA;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get('/data/create', function (req, res) {
  const listCategories = [
    {name: 'Smartphones', dbname: 'smartphones', description: 'Smartphones'},
    {name: 'Máy tính bảng', dbname: 'maytinhbang', description: 'Máy tính bảng'},
    {name: 'Điện thoại', dbname: 'dienthoai', description: 'Điện thoại'},
  ];
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db('niit-iproduct');
    listCategories.forEach(value => {
      var listingQuery = {name: value.name};
      var category = {
        $set: {
          name: value.name,
          dbname: value.dbname,
          description: value.description,
        }
      };
      dbo.collection('categories').updateOne(listingQuery, category, {upsert: true}, function (error, response) {
        if (error) throw error;
        console.log('Documents inserted or updated: ' + JSON.stringify(response));
        res.jsonp({success: true});
      });
    });
  });
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
      system_id: null
    }
  };
// List sample products
  mongoClient.connect(url, function (error, database) {
    if (error) throw error;
    const dbo = database.db('niit-iproduct');
    dbo.collection('products').updateOne(listingQuery, listProducts, {upsert: true}, function (error, response) {
      if (error) throw error;
      console.log('Documents inserted or updated: ' + JSON.stringify(response));
      res.jsonp(response);
    });
  })
});
app.listen(port, env.SERVER_NAME, function () {
  console.log('Example app listening on port ' + port + '!')
});
