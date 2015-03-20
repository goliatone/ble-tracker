var fs = require('fs');
var gm = require('gm');

var express = require('express');
var router = express.Router();
var User = require('../models/users');

router.post('/register', function(req, res) {

    var uuid = req.body.uuid; //Device UUID for now, using iPhone app
    var email = req.body.email;

    console.log('REGISTERING USER', email);
    console.log('REGISTERING IMAGE', req.files);
    var image = req.files['image[]'];

    if(!image || !image.name){
        console.log("There was an error");
        res.send({status:false, message:'Image name not present'});
    }

    var imageName = image.name;
    var newPath = process.env.PWD + "/public/images/avatars/" + imageName;
    var imageUrl = "/user/avatar/" + imageName;

    var user = {
        avatarUrl: imageUrl,
        email: email,
        uuid: uuid,
        createdAt: Date.now()
    };

    gm(image.path)
    .resize(256)
    .write(newPath, function (err) {
        if (err) return res.send({status:false, message:'Image name not present'});
        User.collection.insert([user], {}, function(err, docs){
            if(err) return console.error('ERROR', err);

            //TODO: We should only find and return users currently active/loged in
            User.collection.find({}).toArray(function(err, docs){
                console.log('==> INSERT, INSERT', docs);
                router.app.io.sockets.emit('users.update', docs);
                res.send({status: true, result: user});
            });
        });

    });

    return;

    fs.readFile(image.path, function (err, data) {

        var imageName = image.name;

        /// If there's an error
        if(!imageName){
            console.log("There was an error");
            res.send({status:false, message:'Image name not present'});
        } else {

            var newPath = process.env.PWD + "/public/images/avatars/" + imageName;
            var imageUrl = "/user/avatar/" + imageName;

            var user = {
                avatarUrl: imageUrl,
                email: email,
                uuid: uuid,
                createdAt: Date.now()
            };
            console.log('SAVE USER', user);

            // User.collection.insert([user])
            User.collection.insert([user], {}, function(err, docs){
                if(err) return console.error('ERROR', err);

                //We should only find and return users currently active/loged in
                User.collection.find({}).toArray(function(err, docs){
                    console.log('==> INSERT, INSERT', docs);
                    //TODO: 0_0 This whole thing is an exercise on lean
                    //methodology, right? Do things that do not scale...
                    router.app.io.sockets.emit('users.update', docs);
                });
            });

            gm('/path/to/my/img.jpg')
            .resize(128)
            .write('/path/to/resize.png', function (err) {
              if (!err) console.log('done');
            });

            /// write file to uploads/fullsize folder
            fs.writeFile(newPath, data, function (err) {
                //We should check for ajax in headers:
                res.send({status: true, result: user});
                // res.redirect(imageUrl);
            });
        }
    });
});

router.get('/avatar/:file', function (req, res){
    console.log('ERE');
    // return res.send({msg:process.env.PWD + "/public/images/avatars/" + req.params.file})
    file = req.params.file;
    try {
        var img = fs.readFileSync(process.env.PWD + "/public/images/avatars/" + file);
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');
    } catch(e){
        res.send(404);
    }

});


router.get('/list', function(req, res){
    User.collection.find({}).toArray(function(err, docs){
        if(!err) return res.send(docs);
        else res.send(500, err);
        //TODO: 0_0 This whole thing is an exercise on lean
        //methodology, right? Do things that do not scale...
        // router.app.io.sockets.emit('users.update', docs);
    });
});



module.exports = function(app){
    //TODO: namespace it to demo?!
    app.use('/user', router);
    router.app = app;
};
