var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');


var fs = require('fs');
var http = require('http');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', ejs);
app.engine('html', ejs.renderFile);

app.get('/floorplan', function(req, res) {
    res.sendFile(__dirname+'/public/floorplan.html');
});

//////
var beacons = require('./routes/beacons')(app);
var beacons = require('./routes/users')(app);
//////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// starting http and https servers
var port = process.env.PORT || 8080;
app.set('port', port);
var http = require('http').createServer(app).listen(port, function() {
    console.log('http server listening on port %s', app.get('port'));
});

////////////////////////////////////
// Socket.IO setup
////////////////////////////////////
var devices = {};

var io = require('socket.io')(http);

// http://stackoverflow.com/questions/8467784/sending-a-message-to-a-client-via-its-socket-id
io.on('connection', function(socket) {
    console.log('=> a user connected', socket.id);

    socket.join('global');

    /////////////////
    // Handle Devices
    /////////////////
    socket.on('device.ack', function(payload){
        console.log('DEVICE ACK', payload);

        devices[socket.id].deviceId = payload.uuid;

        socket.broadcast.emit('device.connected', {
            deviceId: payload.uuid,
            socketId: socket.id
        });
    });

    /////////////////
    // Handle Beacons
    /////////////////
    socket.on('ble.ack', function(payload){
        console.log('BLE ACK', payload);
        socket.broadcast.emit('device.connected', {
            deviceId: 'payload.uuid',
            socketId: socket.id
        });
    });

    socket.on('ble.range', function(payload){
        console.log('ble.range', payload)
        socket.broadcast.emit('ble.inrange', payload);
    });


    socket.on('disconnect', function(){
        console.log('=> DISCONNECT', devices[socket.id].deviceId);
        socket.emit('device.disconnected', {
            deviceId: devices[socket.id].deviceId
        });
    });

    devices[socket.id] = {
        socket: socket
    };
});

//Expose the application
module.exports = app;
