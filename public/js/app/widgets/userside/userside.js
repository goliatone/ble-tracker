define('userside', function(require){

    require('css!app/widgets/userside/userside.css');

    var Ractive = require('ractive');
    var template = require('text!app/widgets/userside/userside.html');

    var Userside = Ractive.extend({
        template: template,
        append:true,
        data:{
            members:[{name:'Pepe'}, {name:'Rone'}, {name:'Goliat'}]
        }

    });

    Ractive.components['user-side'] = Userside;

    return Userside;
});
