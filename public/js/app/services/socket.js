define('socket', function(require){
    var io = require('socketio');
    var gpub = require('gpub');
    var extend = require('extend');

    var DEFAULTS = {
        autonitialize: true,
        _client: {
            url: window.location.protocol + '//' + window.location.host
        },
        ackPayload: {
            uuid:getUUID()
        },
        WSClient: function(config){
            return io(config.url);
        }
    }

    function Client(config){

        config = extend({}, DEFAULTS, config);

        if(config.autonitialize) this.init(config);
    }

    Client.prototype.init = function(config){
        if(this.initialized) return;
        this.initialized = true;

        extend(this, DEFAULTS, config);

        this.client = this.WSClient(this._client);
        this.client.on('connect', this.onConnect.bind(this));
        this.client.on('disconnect', this.onDisconnect.bind(this));
    };

    Client.prototype.onConnect = function(){
        console.info('*IO => connected', arguments);
        this.client.emit('device.ack', this.ackPayload);
    };

    Client.prototype.onDisconnect = function(){
        console.log('ON DISCONNECT', arguments);
    };

    return Client;
});



function getUUID() {
    function makeAndStore() {
        var uuid = makeUUID();
        localStorage.setItem('__uuid__', uuid);
        return uuid;
    }

    function makeUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a, b) {
            return b = Math.random() * 16, (a == "y" ? b & 3 | 8 : b | 0).toString(16)
        });
    }

    return localStorage.getItem('__uuid__') || makeAndStore();
}
