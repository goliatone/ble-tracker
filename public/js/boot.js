/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    baseUrl: '/js',
    paths: {
        'main': 'app/main',
        floormap:'app/widgets/floormap',

        socket:'app/services/socket',

        d3:'vendors/d3/d3',
        socketio: '/socket.io/socket.io',
        floorplan:'vendors/floorplan/d3.floorplan.min',
        scatterplot:'app/utils/d3.floorplan.scatterplot',

        'gpub': 'vendors/gpub/src/gpub',

        // 'gconfig': 'vendors/gconfig/gconfig',
        // 'gconfig.path': 'vendors/gconfig/gconfig.path',
        // 'gconfig.qstring': 'vendors/gconfig/gconfig.qstring',
        // 'gconfig.interpolate': 'vendors/gconfig/gconfig.interpolate',

        'extend': 'vendors/gextend/src/extend',
        // 'keypath': 'vendors/gkeypath/keypath',
        // 'templatecontext': 'vendors/templatecontext/templatecontext',



        // 'preloader': 'views/preloader',
        // 'ractive': 'vendors/ractive/ractive',
        // 'jquery': 'vendors/jquery/jquery',

    }
});
define('boot', function(require) {
    console.warn('Loading');

    require('main');
    require('floormap');

    // var App = require('app');

});
