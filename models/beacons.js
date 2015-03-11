var path = require('path');
var Engine = require('tingodb')();

var db = new Engine.Db(path.resolve('./data'), {});

function Beacon(){}
Beacon.pings   = db.collection('beacon_pings');
Beacon.beacons = db.collection('beacons');
Beacon.confs   = db.collection('beacon_configurations');


Beacon.savePing = function(payload){
    Beacon.pings.insert([payload]);
};

Beacon.saveConfig = function(payload){
    Beacon.confs.insert([payload]);
};


module.exports = Beacon;
