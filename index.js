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


//////// CONFIG
//APP:EXPRESS
var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(process.env.PWD + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cookieParser());
app.use(express.static(process.env.PWD + '/public'));

app.set('views', path.join(process.env.PWD, 'views'));
app.set('view engine', ejs);
app.engine('html', ejs.renderFile);

app.get('/floorplan', function(req, res) {
    res.sendFile(process.env.PWD + '/public/floorplan.html');
});

////// ROUTES /////
app.get('/beacon-chart', function(req, res) {
    res.sendFile(process.env.PWD + '/public/charts.html');
});
var beacons = require('./routes/beacons')(app);
var beacons = require('./routes/demo')(app);
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
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
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


//ZEROCONF
require('./config/zeroconf')();

////////////////////////////////////
// Socket.IO setup
////////////////////////////////////
var Beacons = require('./models/beacons');

var devices = {};
var users = [{
     "avatarUrl": "/user/avatar/4b0e51d3cf0723703c422c3a0d97ab4a.jpg",
    "email": "pepe",
    "uuid": "be97c86e-3bee-4aff-807b-e9c1e4e38e76",
    "createdAt": 1426625289613
},{
    "avatarUrl": "/user/avatar/912c02d0382400b777a9f029f96f225f.jpg",
    "email": "pepe@pe.com",
    "uuid": "be97c86e-3bee-4aff-807b-e9c1e4e38e76",
    "createdAt": 1426625234200
},{
    "avatarUrl": "/user/avatar/468f22cf42b5c26e2c638dc4845036a3.jpg",
    "email": "pepe@gmail.com",
    "uuid": "be97c86e-3bee-4aff-807b-e9c1e4e38e76",
    "createdAt": 1426625143458
},{
    "avatarUrl": "/user/avatar/fd74afbf64bb87c9eb7b5a9ab98bddd0.jpg",
    "email": "so@l.o",
    "uuid": "be97c86e-3bee-4aff-807b-e9c1e4e38e76",
    "createdAt": 1426621542773
}]

var io = require('socket.io')(http);

// http://stackoverflow.com/questions/8467784/sending-a-message-to-a-client-via-its-socket-id
io.on('connection', function(socket) {
    console.log('=> a user connected', socket.id);

    // socket.join('global');

    /////////////////
    // Handle Devices
    /////////////////
    socket.on('device.ack', function(payload){
        console.log('DEVICE ACK', payload);

        devices[socket.id].deviceId = payload.uuid;

        //TODO: Query user by deviceid. Store it in current users.
        //send update to clients.
        var deviceData = {
            deviceId: payload.uuid,
            socketId: socket.id
        };
        socket.broadcast.emit('device.connected', deviceData);

        sendCurrentUsers(socket, deviceData);
    });


    function sendCurrentUsers(socket, payload){
        //Mock reaching out to db to get user info from device uuid

        setTimeout(function(){
            socket.broadcast.emit('users.update', users);
        }, 2000);
    }

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
        //TODO: Make this for realz
        Beacons.savePing(payload);
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
