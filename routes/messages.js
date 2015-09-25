var express = require('express'),
    extend = require('gextend'),
    router = express();

require('../config');

var SNS = require('node-sns');


var SCECRET_ACCESS_KEY = process.env.SCECRET_ACCESS_KEY,
    ACCESS_KEY = process.env.ACCESS_KEY,
    APPLICATION_ARN = process.env.APPLICATION_ARN,
    ENDPONT_ARN = process.env.ENDPONT_ARN;

var client = new SNS({
    region: 'us-east-1',
    apiVersion: '2010-03-31',
    key: ACCESS_KEY,
    secret: SCECRET_ACCESS_KEY,
    platform: 'APNS_SANDBOX',
    applicationArn: APPLICATION_ARN
});


router.get('/', function(req, res) {
    res.sendFile(process.env.PWD + '/public/messages.html');
});


router.post('/send', function(req, res) {
    var payload =  req.body;
    // var payload =  extend({}, req.body);
/*
    findEndpointArn(req.body.receiver).then(function(arn){
        return client.publish(arn, req.body.message);
    }).then(function(){

    }).catch(function(e){

    });
*/
    if(req.body.message){
        client.publish(ENDPONT_ARN, req.body.message, function(){
            console.log('HERE', arguments);
        });
    }

    console.log('BODY', payload);

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
