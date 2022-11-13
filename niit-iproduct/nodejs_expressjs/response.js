var express = require('express');
var app = express();
// res.send
app.get('/', (req, res) => {
    res.send({web:['nodejs', 'npm', 'expressjs']});
    res.send('<h1>ExpressJS</h1>');
    res.send('Normal text');
});
// res.json
app.get('/json', (req, res) => {
    res.json({web:['nodejs', 'npm', 'expressjs']});
});
// res.status
app.get('/status', (req, res) => {
    res.status(302);
});
// res.redirect
app.get('/redirect', (req, res) => {
    res.redirect('/');
});
// res.render
app.set('views', __dirname + '/template');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/home', (req, res) => {
    res.render('home.html', {name: 'DAO TIEN TU'});
});
// res.end
app.get('/end', (req, res) => {
    res.send('End Game.');
    res.end();
});
app.listen(3000, '127.0.0.1', () => console.log('Example app listening on port 3000!'))