var fs = require('fs');
var express = require('express');
var router = express.Router();
var User = require('../models/users');

router.post('/register', function(req, res) {

    var uuid = req.body.uuid; //Device UUID for now, using iPhone app
    var email = req.body.email;

    console.log('REGISTERING USER', email);
    console.log('REGISTERING IMAGE', req.files);
    var image = req.files['image[]'];
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

        User.collection.insert([user]);

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



module.exports = function(app){
    //TODO: namespace it to demo?!
    app.use('/user', router);
};
