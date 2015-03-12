var express = require('express'),
    extend = require('gextend'),
    router = express();

var Beacon = require('../models/beacons');

router.get('/beacon', function(req, res) {
    res.sendFile(process.env.PWD + '/public/beacon.html');
});


router.get('/uuid/:uuid/:major/:minor', function(req, res){
    var query = {
        uuid: req.params.uuid,
        major: req.params.major,
        minor: req.params.minor,
        // location: settings.store_id
    };

    Beacon.beacons.find(query).toArray(function(err, docs) {
        res.json({
            success: true,
            results: docs
        });
    });
});

router.post('/uuid/:uuid/:major/:minor/', function(req, res) {
    var payload =  req.body;
    // var payload =  extend({}, req.body);

    payload.uuid = req.params.uuid;
    payload.major = req.params.major;
    payload.minor = req.params.minor;

    payload.created_at = Date.now();

    Beacon.beacons.insert([payload]);

    res.json({
        success: true,
        beacon: payload
    });
});

router.get('/list', function(req, res) {
    Beacon.pings.find({}).toArray(function(err, docs) {
        res.json({
            success:true,
            results:docs
        });
    });
});

router.post('/register', function(req, res) {
    var payload = req.body;
    payload.created_at = Date.now();

    Beacon.confs.insert([payload]);

    res.json({
        success: true,
        beacon: payload
    });
});


router.post('/configure', function(req, res) {
    var payload = req.body;
    payload.created_at = Date.now();

    Beacon.confs.insert([payload]);

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
