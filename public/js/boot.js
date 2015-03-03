/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    baseUrl: '/js',
    paths: {
        main: 'app/main',
        config: 'app/config',

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
        // 'jquery': 'vendors/jquery/jquery',
    },
    map: {
        '*': {
            'css': 'vendors/require-css/css'
        }
    }
});

define('boot', function(require) {
    console.warn('Loading');

    require('main');
    require('floormap');

    require('userside');

    var Ractive = require('ractive');
    // var App = require('app');
    //
    var view = new Ractive({
        template: '#content-template',
        el: 'content',
        append: true,
        message:'Hola Mundo Mundial!!!'
    });

});
