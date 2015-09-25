define('userside', function(require){

    require('css!userside.css');

    var Ractive = require('ractive');
    var template = require('text!userside.html');

    var Userside = Ractive.extend({
        template: template,
        append: true,
        data:{
            members:[
                {
                  id:'95a178046cb015014e0ce3927bac870b',
                  avatarUrl: 'images/avatars/95a178046cb015014e0ce3927bac870b.jpg'
                },
                {
                  id:'270faa15aea3467ea7688e69d728aea7',
                  avatarUrl: 'images/avatars/270faa15aea3467ea7688e69d728aea7.jpg'
                },
                {
                  id:'b2f3a868a97a60f444e8a7b6a8c16a8a',
                  avatarUrl: 'images/avatars/b2f3a868a97a60f444e8a7b6a8c16a8a.jpg'
                }
            ]
        }

    });

    Ractive.components['user-side'] = Userside;

    return Userside;
});
