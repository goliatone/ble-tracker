var fs = require('fs');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    fs.readFile(req.files.image.path, function (err, data) {

        var imageName = req.files.image.name;

        /// If there's an error
        if(!imageName){
            console.log("There was an error")
            res.redirect("/");
            res.end();
        } else {

          var newPath = process.env.PWD + "/public/images/avatars/" + imageName;

          /// write file to uploads/fullsize folder
          fs.writeFile(newPath, data, function (err) {
            /// let's see it
            res.redirect("/uploads/avatar/" + imageName);
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
    app.use('/upload', router);
};
