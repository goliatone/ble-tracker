var path = require('path');
var Engine = require('tingodb')();

var db = new Engine.Db(path.resolve('./data'), {});

function User(){}
User.collection = db.collection('users');


User.savePing = function(payload, cb){
    User.collection.insert([payload], cb);
};

User.saveConfig = function(payload, cb){
    User.collection.insert([payload], cb);
};

// User.createUser = function()


module.exports = User;
