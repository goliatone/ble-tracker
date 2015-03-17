define('userside', function(require){

    require('css!userside.css');

    var Ractive = require('ractive');
    var template = require('text!userside.html');

    var Userside = Ractive.extend({
        template: template,
        append:true,
        data:{
            members:[
                // {id:'95a178046cb015014e0ce3927bac870b'},
                // {id:'270faa15aea3467ea7688e69d728aea7'},
                // {id:'b2f3a868a97a60f444e8a7b6a8c16a8a'}
            ]
        }

    });

    Ractive.components['user-side'] = Userside;

    return Userside;
});
