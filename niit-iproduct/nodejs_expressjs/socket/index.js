// app should be an instance() of express
const app = require('express')();
const http = require('http').Server(app);
const port = 4000;
const io = require('socket.io')(http);
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket) {
    console.log('Detected a new connection');
    socket.on('disconnect', function(){
        console.log('--> A connection is disconnected');
    });
});
http.listen(port, function() {
    console.log(`Listening on *:${port}`);
});