const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchdb = require('node-couchdb');

const couch = new NodeCouchdb({
    auth: {
        user: 'admin',
        password: 'admin'
    }
});
const dbName = 'employees';
const viewUrl = '_design/all_employees/_view/all';
couch.listDatabases().then(function(dbs){
    console.log(dbs);
});
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get("/", (req, res) => {
  res.send("Working........");
  couch.get(dbName, viewUrl).then(function(data, headers, status){
    console.log(data.data.rows);
  });
}, function(error){
    res.send(error);
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
