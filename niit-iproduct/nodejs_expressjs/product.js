/**
 * npm install --save express mysql body-parser hbs
 */
// Use path module
const path = require('path');
// Use express module
const express = require('express');
// Use hbs view engine
const hbs = require('hbs');
// Use bodyParser middleware
const bodyParser = require('body-parser');
// Use mysql database
const mysql = require('mysql');
const app = express();
// Create connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'n2cms'
});
// Connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});
// Set views file
app.set('views', path.join(__dirname, 'views'));
// Set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// Set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));
// Route for homepage
app.get("/", (req, res) => {
    let sql = "SELECT * FROM products";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('products/index', {
            results: results
        });
    });
});
// Route for insert data
app.post("/save", (req, res) => {
    let data = {name: req.body.name, price: req.body.price};
    let sql = "INSERT INTO products SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
// Route for update data
app.post("/update", (req, res) => {
    let sql ="UPDATE products SET name='" + req.body.name + "', price='" + req.body.price + "' WHERE id = " + req.body.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
app.post("/delete", (req, res) => {
    let sql = "DELETE FROM products WHERE id = " + req.body.id + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
// Server listening
app.listen(8000, () => {
    console.log('Server is running at port 8000');
});