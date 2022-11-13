const app = require('express')();
const mysql = require('mysql');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
/* Creating POOL MySQL connection */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fbstatus',
    debug: false
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/status.html');
});
/* This is auto initiated event when client connects to your machine */
io.on('connection', function (socket) {
    console.log('A user is connected');
    socket.on('status added', function (status) {
        add_status(status, function (res) {
            if (res) {
                io.emit('refresh feed', status);
            } else {
                io.emit('error');
            }
        });
    });
    socket.on('status list', function () {
        list_status(function (res) {
            if (res) {
                io.emit('refresh list', res);
            } else {
                io.emit('error');
            }
        });
    });
    socket.on('disconnect', function () {
        console.log('--> A connection is disconnected');
    });
});
var add_status = function (status, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(false);
            return;
        }
        connection.query("INSERT INTO `fbstatus` (`s_text`) VALUES ('" + status + "')", function (err) {
            connection.release();
            if (!err) {
                callback(true);
            }
        });
        connection.on('error', function () {
            callback(false);
        });
    });
};
var list_status = function (callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(false);
            return;
        }
        connection.query("SELECT s_text FROM fbstatus ORDER BY status_id DESC", function (err, rows) {
            connection.release();
            if (!err) {
                callback(rows);
            }
        });
        connection.on('error', function (err) {
            callback(false);
        });
    });
};
http.listen(port, function () {
    console.log('Listening on ' + port);
});
