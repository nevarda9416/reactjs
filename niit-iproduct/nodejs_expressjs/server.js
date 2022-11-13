var express = require('express');
var app = express();
app.listen(3000, '127.0.0.1', () => console.log('Example app listening on port 3000!'))
app.get('/', (req, res) => res.send('<h2>Hello World!</h2>'))
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'n2cms'
});
con.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT title, author_name FROM posts";
    con.query(sql, function(err, results) {
        if (err) throw err;
        //console.log(results);
    });
});
// Set dynamic views file
var path = require('path');
var hbs = require('hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.get('/users/create', (req, res) => {
    res.render('users/create');
});
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.post('/users', (req, res) => {console.log(req.body);
    let data = {name: req.body.name, email: req.body.email};
    let sql = "INSERT INTO n2cms.users SET ?";
    let query = con.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/users');
        console.log('Create success.');
    });
});
app.get('/users', (req, res) => {
    let sql = "SELECT id, name, email FROM users";
    let query = con.query(sql, (err, users) => {
        if (err) throw err;
        res.render('users/index', {
            users: users
        });
    });
});