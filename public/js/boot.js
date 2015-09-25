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
        sparkle: 'app/widgets/sparkle/sparkle',

        socket:'app/services/socket',
        'beacons.helper': 'app/utils/beacons.helper',

        d3:'vendors/d3/d3',
        c3: 'vendors/c3js-chart/c3',

        socketio: '/socket.io/socket.io',
        floorplan:'vendors/floorplan/d3.floorplan.min',
        scatterplot:'app/utils/d3.floorplan.scatterplot',
        'd3.heatmap.grid':'app/utils/d3.heatmap.grid',
        'd3.floorplan.heatmap':'app/utils/d3.floorplan.heatmap',

        gpub: 'vendors/gpub/src/gpub',

        extend: 'vendors/gextend/src/extend',

        'text': 'vendors/requirejs-text/text',
        'ractive': 'vendors/ractive/ractive',
        'jquery': 'vendors/jquery/dist/jquery',
    },
    shim:{
        d3: { exports: 'd3' },
        nvd3: {
          exports: 'nv',
          deps: ['d3']
        }
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
    require('d3')
    // require('main');
    require('sparkle');
    require('floormap');
    require('userside');
    require('css!vendors/c3js-chart/c3.min');
    var c3 = require('c3');

    var grid = require('d3.heatmap.grid');
    console.info(grid)

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
        // pl.debug([pos], function(d){ return d.id; });
    });

    socket.client.on('ble.inrange', function addUser(payload){
        //TODO: we need to mange this better
        var member = {
            _id: 11,
            avatarUrl: "/user/avatar/a1f603e2-953c-44bc-a0c9-f90103dbdc22.png",
            createdAt: 1426872474062,
            email: "pepe@ro.es",
            uuid: "adfadf-de50-4032-bfe1-94ff07ca3f9c"
        };

        // view.findComponent('user-side').merge('members', [member], {
        //     compare: 'uuid'
        // });
    });

    BeaconsHelper.data = {};
    socket.client.on('ble.inrange', function(payload){
        payload.beacons.forEach(function(b){
            var store = BeaconsHelper.getStoreForBeacon(b, BeaconsHelper.data);
            store.push(b);
        });
        // console.log('##=>udpates', BeaconsHelper.data);
    });


    /*
     * Update scatter plot graph
     */
    /*socket.client.on('ble.inrange', function(payload){

        payload.beacons.forEach(function(b){
            var id = b.major + '::' + b.minor;
            var d = getBeaconHolder(id);
            console.log(d)
            d.push(b.distance * 100);
        });

        console.log('=>udpates', data)
        // udpateGraph(updates)
        // view.set('sparkle.updates', updates);
    });*/

    socket.client.on('users.update', function(users){
        console.log('=> MEMEBER COUNT CHANGED', users);

        view.findComponent('user-side').merge('members', users, {
            compare: 'uuid'
        });
    });

    var DATA = {
          x: 'x',
          //%Y-%m-%d %H:%M:%S
          xFormat: '%Y-%m-%d %H:%M', // 'xFormat' can be used as custom format of 'x'
          columns: [
            ['x', '2015-09-24 09:00', '2015-09-24 09:05', '2015-09-24 09:10', '2015-09-24 09:15', '2015-09-24 09:20', '2015-09-24 09:25'],
          //  ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
            ['Main room', 0, 5, 7, 15, 15, 20],
            ['Conf 3', 0, 0, 0, 4, 4, 4],
            ['Phone booth', 0, 1, 1, 1, 1, 1]
        ]
    };
    function getData(data){
        return Object.keys(data).reduce(function(out, entry){
            out.push(data[entry].values);
            return out;
        }, []);
    }
    var chart = c3.generate({
        bindto: '#chart',
        data: DATA,
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d %H:%M'
                }
            }
        },
        subchart: {
            show: true
        },
        zoom: {
            enabled: true
        },
        color: {
            pattern: ['#ff3366', '#0cff34', '#000fff', '#ff2299', '#0caa68', '#0c1c80']
        }
    });



    // view = new Ractive({
    //     template: '#content-template',
    //     el: 'content',
    //     append: true,
    //     message:'Hola Mundo Mundial!!!'
    // });
    //
    // window.v = view;

/*
//TODO: Average all items.
    var readings = {index:0};
    socket.client.on('ble.inrange', function(payload){
        var beacons = payload.beacons;

        var makeId = function(beacon){
            return [beacon.major, beacon.minor].join('::');
        };

        var getStore = function(beacon){
            var id = makeId(beacon);
            return readings[id] || (readings[id] = []);
        };

        Array.isArray(beacons) && beacons.forEach(function(beacon){
            getStore(beacon).push(beacon);
            setTimeout(average.bind(null, readings), 0);
        });
    });

    var start = Date.now();
    function average(src){
        src.index++;
        var oldt = start;
        start = Date.now();
        Object.keys(src).forEach(function(id){
            if(!Array.isArray(src[id])) return
            console.log('ID: %s ================= %s', id, start - oldt);
            var sum = src[id].reduce(function(a, b){
                console.log(b.distance)
                return a + b.distance;
            }, 0);
            console.log('avg', sum/src.index);
        });

    }

    window.readings = readings;
*/
});
