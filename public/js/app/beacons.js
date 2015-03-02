;(function(exports){

    function BeaconCollection(){}

    BeaconCollection.prototype.fromJSON = function(json){

    };

    //filter by uuid
    //filter by major

    var data = {
        "uuid": "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
        "major": 444,
        "minor": 3,
        "color": "green"
    };

    function Beacon(){
        var conf = {
            color: 0,
            proximity: 3,
            rssi: -71,
            proximityUUID: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
            firmwareState: 0,
            connectionStatus: 2,
            distance: 1.444936548034863,
            minor: 3,
            major: 444
        };
    }

    Beacon.prototype.fromJSON = function(obj){
        var filter = function(prop){
            if(prop === 'proximityUUID') return 'uuid';
            return prop;
        };

        // this.jsonMapping
        var property;
        Object.keys(obj).forEach(function(prop){
            property = filter(prop);
            this[prop] = obj[prop];
        }, this);

        return this;
    };

    Beacon.prototype.setPosition = function(x, y){
        this.position = {x: x, y: y};
        return this;
    };

    Beacon.prototype.getBeaconId = function(){
        return [this.uuid, this.major, this.minor].join('::');
    };

    Beacon.prototype.setBeaconId = function(bid){
        var ids = bid.split('::');
        this.uuid = ids[0];
        this.major = parseInt(ids[1]);
        this.minor = parseInt(ids[2]);
        return this;
    };

    exports.Beacon = Beacon;
    exports.BeaconCollection = BeaconCollection;

    console.log('HERE')

    var b = new Beacon();
    b.fromJSON(data);
    console.log('B',b.getBeaconId())
})(this);
