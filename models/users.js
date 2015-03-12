var path = require('path');
var Engine = require('tingodb')();

var db = new Engine.Db(path.resolve('./data'), {});

function User(){}
User.collection = db.collection('users');


User.savePing = function(payload){
    User.collection.insert([payload]);
};

User.saveConfig = function(payload){
    User.collection.insert([payload]);
};


module.exports = User;
