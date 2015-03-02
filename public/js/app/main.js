/*
 * leadership_board
 * Wall Exhibit: Leadership Board
 *
 */
/*global define:true*/
/* jshint strict: false */
define('main', function(require) {
    console.log('APP');

    var GPub = require('gpub');
    var Client = require('socket');

    GPub.observable(Client);

    var socket = new Client({});

    socket.client.on('ble.inrange', function(payload) {
        console.log('IN RANGE');
        var pos = getPosition(payload.beacons);
        if(isNaN(pos.x) || isNaN(pos.y) || Math.abs(pos.x) === Infinity || Math.abs(pos.y) === Infinity ) return console.warn('OUT', pos);
        pl.refresh([pos], function(d){ return d.id; });
    });

    return socket;

});


var geometry = {
    "333::1": {"x":2074, "y":685, "label": "middle-right"},
    "333::2": {"x":1664, "y":51, "label": "top-left"},
    "333::3": {"x":1675, "y":685, "label": "middle-left"},
    "444::1": {"x":1675, "y":1307, "label": "bottom-left"},
    "444::2": {"x":2148, "y":1307, "label": "bottom-right"},
    "444::3": {"x":2125, "y":51, "label": "top-right"}
};

function getPosition(beacons){
    if(!beacons) return console.warn('getPosition: No beacons');
    beacons = beacons.sort(function(a, b){
        return a.distance - b.distance;
    });

    var set = beacons.map(function(beacon){
        var point = {};
        point.id = 'UPDATE_THIS_REALLY!!',
        point.r = beacon.rssi;
        point.d = beacon.distance * 100;
        point.x = geometry[beacon.major + '::' + beacon.minor].x;
        point.y = geometry[beacon.major + '::' + beacon.minor].y;
        return point;
    });

    // return distancePoints(set)[0];

    set = set.slice(0, 3);
    // console.log('ORDER', set)
    // return getTrilateration.apply(null, set);
    return getCoordinate.apply(null, set);
}

function getCoordinate(p1, p2, p3) {
    var w = p1.d * p1.d - p2.d * p2.d - p1.x * p1.x - p1.y * p1.y + p2.x * p2.x + p2.y * p2.y;

    var z = p2.d * p2.d - p3.d * p3.d - p2.x * p2.x - p2.y * p2.y + p3.x * p3.x + p3.y * p3.y;

    var x = (w * (p3.y - p2.y) - z * (p2.y - p1.y)) / (2 * ((p2.x - p1.x) * (p3.y - p2.y) - (p3.x - p2.x) * (p2.y - p1.y)));

    var y = (w - 2 * x * (p2.x - p1.x)) / (2 * (p2.y - p1.y));

    var v = (z - 2 * x * (p3.x - p2.x)) / (2 * (p3.y - p2.y));
    y = (y + v) / 2;

    return {
        id:p1.id,
        x: x,
        y: y
    };
}
