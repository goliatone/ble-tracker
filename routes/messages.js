var express = require('express'),
    extend = require('gextend'),
    router = express();

var sns = require('node-sns');

router.get('/dashboard', function(req, res) {
    res.sendFile(process.env.PWD + '/public/messages.html');
});


router.post('/send', function(req, res) {
    var payload =  req.body;
    // var payload =  extend({}, req.body);

    payload.uuid = req.params.uuid;

    res.json({
        success: true,
        response: "Message sent"
    });
});







module.exports = function(server) {
    //register beacons with ble path prefix.
    server.use('/messages', router);
    return router;
};
