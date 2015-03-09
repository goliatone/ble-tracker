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

        d3: 'vendors/d3/d3',
        c3: 'vendors/c3js-chart/c3',

        socketio: '/socket.io/socket.io',
        floorplan:'vendors/floorplan/d3.floorplan.min',
        scatterplot:'app/utils/d3.floorplan.scatterplot',

        gpub: 'vendors/gpub/src/gpub',


        extend: 'vendors/gextend/src/extend',

        'text': 'vendors/requirejs-text/text',
        // 'preloader': 'views/preloader',
        'ractive': 'vendors/ractive/ractive',
        'jquery': 'vendors/jquery/dist/jquery',
    },
    shim:{
        d3: { exports: 'd3' },
        c3: {
          exports: 'c3',
          deps: ['d3']
        }
    },
    map: {
        '*': {
            'css': 'vendors/require-css/css'
        }
    }
});

define('chart', function(require) {
    console.warn('Loading');

    require('jquery');
    var c3 = require('c3');

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

    var data = {
        '333::1': { values:['333::1']},
        '333::2': { values:['333::2']},
        '333::3': { values:['333::3']},
        '444::1': { values:['444::1']},
        '444::2': { values:['444::2']},
        '444::3': { values:['444::3']}
    };

    var getBeaconHolder = function(id){
        if(data[id]) return data[id].values;
        var out = {};
        out[id] = { values: [id]};
        data.push(out);
        return data[id].values;
    };

    socket.client.on('ble.inrange', function(payload){

        payload.beacons.forEach(function(b){
            var id = b.major + '::' + b.minor;
            var d = getBeaconHolder(id);
            d.push(b.rssi);
        });

        chart.load({
            columns: getData(data)
        });

        view.set('beacons', data);
        // view.set('beacons', getData(data));

        // console.log('=>udpates', getData(data))
        // udpateGraph(updates)
        // view.set('sparkle.updates', updates);
    });

    function getData(data){
        return Object.keys(data).reduce(function(out, entry){
            out.push(data[entry].values);
            return out;
        }, []);
    }

    var chart = c3.generate({
        data: {
                columns: getData(data)
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



    view = new Ractive({
        template: '#content-template',
        el: 'content',
        append: true,
        data: {}
    });

    window.v = view;

    // view.observe('beacons', function())

});


