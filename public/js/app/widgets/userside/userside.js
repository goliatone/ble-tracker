define('userside', function(require){

    require('css!userside.css');

    var Ractive = require('ractive');
    var template = require('text!userside.html');

    var Userside = Ractive.extend({
        template: template,
        append:true,
        data:{
            members:[]
        }

    });

    Ractive.components['user-side'] = Userside;

    return Userside;
});
