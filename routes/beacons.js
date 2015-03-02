var express = require('express'),
    router = express();

var Engine = require('tingodb')(),
    path = require('path'),
    assert = require('assert');

var db = new Engine.Db(path.resolve('./data'), {});
var BeaconPings = db.collection("beacon_pings");


//PULL FROM ROUTES
// app.get('/uuid/:beacon/:major/:minor/', function(req, res){
//   res.sendfile('templates/beacon.html');
// });

// app.post('/uuid/:beacon/:major/:minor/', function(req, res){
//     var filePath = __dirname + '/public/' + req.params.beacon + '.json';
//     fs.writeFile(filePath, req.body.data, function () {
//         res.redirect('/data/' + req.params.beacon + '/' + req.params.major + '/' + req.params.minor + '/');
//     });
// });

// app.get('/data/:beacon/:major/:minor/', function(req, res){
//   var filePath = __dirname + '/public/' + req.params.beacon + '.json';
//   fs.readFile(filePath, function(err, data) {
//     res.send(data);
//   });
// });

// app.get('/', function(req, res){
//   res.sendfile('templates/index.html');
// });

// app.post('/', function(req, res){

//   var data = querystring.stringify({
//         uuid: req.body.uuid,
//         major: req.body.major,
//         minor: req.body.minor,
//         location: settings.store_id
//       });

//   var options = {
//       host: 'localhost',
//       port: 8000,
//       path: '/beacon/add/',
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': Buffer.byteLength(data)
//       }
//   };

//   var req = http.request(options, function(res) {
//       res.setEncoding('utf8');
//       res.on('data', function (chunk) {
//           console.log("body: " + chunk);
//       });
//   });

//   req.write(data);
//   req.end();

//   res.sendfile('templates/index.html');

// });

router.get('/list', function(req, res) {
    BeaconPings.find({}).toArray(function(err, docs) {
        res.json({
            success:true,
            results:docs
        });
    });
});

router.post('/register', function(req, res) {
    // console.log('BEACON REGISTER', req.body);
    var payload = req.body;
    payload.created_at = Date.now();

    BeaconPings.insert([payload]);

    res.json({
        success: true,
        beacon: payload
    });
});

router.post('/checkin', function(req, res){
    console.log('device check in');
    //check out region. Do we have any events
    //for this device in such region? If so, notify:
});



router.delete('/delete', function(req, res) {});


module.exports = function(server) {
    //register beacons with ble path prefix.
    server.use('/beacon', router);
    return router;
};
