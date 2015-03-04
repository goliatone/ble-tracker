define('app', function(require) {

    var extend = require('extend');

    var DEFAULTS = {
        autoinitialize: true
    };

    var App = function(config){
        config = extend({}, this.constructor.DEFAULTS, config);
        if(config.autoinitialize ) this.init(config);
    };

    App.DEFAULTS = DEFAULTS;

    App.prototype.init = function(config){
        if(this.initialized) return;
        this.initialized = true;
        this.logger.info('App instance created');
        extend(this, this.constructor.DEFAULTS, config);

    };

    App.prototype.logger = console;

    return App;

});
