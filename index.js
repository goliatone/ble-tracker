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

//Expose the application
module.exports = app;
