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
    var BeaconsHelper = require('beacons.helper');

    var geometry = require('config').geometry;

    GPub.observable(Client);

    var socket = new Client({});

    socket.client.on('ble.inrange', function(payload) {
        var pos = BeaconsHelper.getPosition(payload.beacons, geometry);
        pos ? pos.id = payload.uuid : (pos = {});
        if(isNaN(pos.x) || isNaN(pos.y) || Math.abs(pos.x) === Infinity || Math.abs(pos.y) === Infinity ) return console.warn('OUT', pos);
        pl.refresh([pos], function(d){ return d.id; });
    });

    return socket;

});
