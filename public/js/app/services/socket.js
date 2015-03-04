define('socket', function(require){
    var io = require('socketio');
    var uuid = require('uuid');
    var extend = require('extend');

    var DEFAULTS = {
        autonitialize: true,
        _client: {
            url: window.location.protocol + '//' + window.location.host
        },
        ackPayload: {
            uuid: uuid.getUUID()
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
