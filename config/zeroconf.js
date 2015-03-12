var mdns = require('mdns');

module.exports = function configure(o){
    o = o || {port: 8080, serviceType: 'http'};
    console.log('ZEROCONF: ' + o.port + ' ' + o.serviceType);
    // advertise a http server on port 8080
    var ad = mdns.createAdvertisement(mdns.tcp(o.serviceType), o.port);
    ad.start();
};

