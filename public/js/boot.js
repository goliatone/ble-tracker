/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    baseUrl: '/js',
    paths: {
        main: 'app/main',
        app: 'app/app',
        config: 'app/config',
        uuid:'app/utils/uuid',

        floormap:'app/widgets/floormap',
        userside: 'app/widgets/userside/userside',

        socket:'app/services/socket',
        'beacons.helper': 'app/utils/beacons.helper',

        d3:'vendors/d3/d3',
        socketio: '/socket.io/socket.io',
        floorplan:'vendors/floorplan/d3.floorplan.min',
        scatterplot:'app/utils/d3.floorplan.scatterplot',

        gpub: 'vendors/gpub/src/gpub',

        // 'gconfig': 'vendors/gconfig/gconfig',
        // 'gconfig.path': 'vendors/gconfig/gconfig.path',
        // 'gconfig.qstring': 'vendors/gconfig/gconfig.qstring',
        // 'gconfig.interpolate': 'vendors/gconfig/gconfig.interpolate',

        extend: 'vendors/gextend/src/extend',
        // 'keypath': 'vendors/gkeypath/keypath',
        // 'templatecontext': 'vendors/templatecontext/templatecontext',



        'text': 'vendors/requirejs-text/text',
        // 'preloader': 'views/preloader',
        'ractive': 'vendors/ractive/ractive',
        'jquery': 'vendors/jquery/dist/jquery',
    },

    map: {
        '*': {
            'css': 'vendors/require-css/css'
        }
    }
});

define('boot', function(require) {
    console.warn('Loading');

    require('jquery');
    // require('main');
    require('floormap');
    require('userside');

    //
    var GPub = require('gpub');
    var Client = require('socket');
    var BeaconsHelper = require('beacons.helper');

    var geometry = require('config').geometry;

    GPub.observable(Client);

    var Ractive = require('ractive');
    var App = require('app');
    var view;
    var socket;

    socket = new Client({});

    socket.client.on('ble.inrange', function renderPosition(payload) {
        var pos = BeaconsHelper.getPosition(payload.beacons, geometry);
        pos ? pos.id = payload.uuid : (pos = {});
        if(isNaN(pos.x) || isNaN(pos.y) || Math.abs(pos.x) === Infinity || Math.abs(pos.y) === Infinity ) return console.warn('OUT', pos);
        pl.refresh([pos], function(d){ return d.id; });
    });

    socket.client.on('ble.inrange', function addUser(payload){
        //TODO: we need to mange this better
        var member = {
            id: payload.uuid
        };

        view.findComponent('user-side').merge('members', [member], {
            compare: 'id'
        });
    });

    socket.client.on('device.connected', function(data) {
        console.log('NEW DEVICE CONNECTED', data);
    });

    socket.client.on('device.disconnected', function(data) {
        console.log('NEW DEVICE CONNECTED', data);
    });
    //


    view = new Ractive({
        template: '#content-template',
        el: 'content',
        append: true,
        message:'Hola Mundo Mundial!!!'
    });

    window.v = view;

});
