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
        nvd3: 'vendors/nvd3/build/nv.d3',

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

define('chart', function(require) {
    console.warn('Loading');

    require('jquery');



    //
    var GPub = require('gpub');
    var Client = require('socket');
    var BeaconsHelper = require('beacons.helper');

    var geometry = require('config').geometry;

    GPub.observable(Client);

    // var Ractive = require('ractive');
    var App = require('app');
    var view;
    var socket;

    socket = new Client({});

    var updates = {};
    var data = [
        {key:'333::1', values:[]},
        {key:'333::2', values:[]},
        {key:'333::3', values:[]},
        {key:'444::1', values:[]},
        {key:'444::2', values:[]},
        {key:'444::3', values:[]},
    ];

    var getBeaconHolder = function(id){
        if(updates[id]) return data[updates[id]].values;
        var index = data.push({key:id, values:[]});
        updates[id] = index - 1;
        return data[updates[id]].values;
    };

    socket.client.on('ble.inrange', function(payload){

        payload.beacons.forEach(function(b){
            var id = b.major + '::' + b.minor;
            var d = getBeaconHolder(id);
            console.log(d)
            d.push(b.distance * 100);
        });

        console.log('=>udpates', data)
        // udpateGraph(updates)
        // view.set('sparkle.updates', updates);
    });



    view = new Ractive({
        template: '#content-template',
        el: 'content',
        append: true,
        message:'Hola Mundo Mundial!!!'
    });

    window.v = view;

    view.observe('sparkle.updates', function(newValue, oldValue, path){
        console.log('SPARKLE.UPDATES', newValue)
        if(newValue === undefined && oldValue === undefined) return;
        if(!view.findComponent('sparkle')) return
        newValue['333::1'] && view.findComponent('sparkle').set('values', newValue['333::1'][0]);
    });

});


