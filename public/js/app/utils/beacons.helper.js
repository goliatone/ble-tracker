define('beacons.helper', function(require){

    function getPosition(beacons, geometry){
        if(!beacons) return console.warn('getPosition: No beacons');
        beacons = beacons.sort(function(a, b){
            return a.distance - b.distance;
        });

        beacons = beacons.sort(function(a, b){
            return a.rssi < b.rssi;
        });

        var set = beacons.map(function(beacon){
            var point = {};
            point.r = beacon.rssi;
            point.d = Math.round(beacon.distance * 100);
            point.x = geometry[beacon.major + '::' + beacon.minor].x;
            point.y = geometry[beacon.major + '::' + beacon.minor].y;
            return point;
        });

        return distancePoints(set)[0];

        set = set.slice(0, 3);
        // return set.concat([getCoordinate.apply(null, set)]);
        // return getTrilateration.apply(null, set);
        return getCoordinate.apply(null, set);
    }

    function distancePoints (beacons, steps) {
        if(beacons.length > 3) beacons = beacons.slice(0, 3);

        function Midpoint (p1, p2) {
            return new Point(Math.round((p1.x + p2.x) / 2), Math.round((p1.y + p2.y) / 2));
        }

        function distance (p1, p2) {
            return Math.round(Math.sqrt( (Math.pow(p1.x - p2.x, 2)) + (Math.pow(p1.y - p2.y, 2)) ));
        }

        function Point (x, y) {
            this.x = x;
            this.y = y;
        }

        var points = [], vertices = new Array(beacons.length);
        var _steps = steps || 20,
            _div = (_steps * 0.5);

        beacons.forEach(function (beacon, n) {
            vertices[n] = [];
            for (var i = 0; i <= _steps; i++) {

                var p = new Point(
                    Math.round(beacon.x + beacon.d * Math.cos(( i / _div ) * Math.PI)),
                    Math.round(beacon.y + beacon.d * Math.sin(( i / _div ) * Math.PI))
                );

                vertices[n].push(p);
            }
        });

        // find first two minimal points
        var dist_i = [];
        vertices[0].forEach(function (p1) {
            vertices[1].forEach(function (p2) {
                var dist = distance(p1, p2);
                dist_i.push({midpoint: new Midpoint(p1, p2), dist: dist});
            });
        });

        dist_i = dist_i.sort(function (a, b) { return a.dist - b.dist; });

        if(dist_i.length < 2) return [];
        var twoPoints = dist_i.slice(0 , 2);

        // check two points against the circle
        var dist_t = [];
        vertices[2].forEach(function (p1) {
            twoPoints.forEach(function (p2) {
                var dist = distance(p1, p2.midpoint);
                dist_t.push({midpoint: new Midpoint(p1, p2.midpoint), dist: dist});
            });
        });

        var p = dist_t
            .sort(function (a,b) { return a.dist - b.dist })
            .map(function (p) { return p.midpoint });
        return p;
    }

    function debugGetCoordinate(p1, p2, p3){
        var out = [p1, p2, p3, distancePoints([p1, p2, p3])[0]];
        console.log('OUT', distancePoints([p1, p2, p3]))
        return out;
        return [p1, p2, p3, getCoordinate(p1, p2, p3)];
    }

    function getCoordinate(p1, p2, p3) {
        var w = p1.d * p1.d - p2.d * p2.d - p1.x * p1.x - p1.y * p1.y + p2.x * p2.x + p2.y * p2.y;

        var z = p2.d * p2.d - p3.d * p3.d - p2.x * p2.x - p2.y * p2.y + p3.x * p3.x + p3.y * p3.y;

        var x = (w * (p3.y - p2.y) - z * (p2.y - p1.y)) / (2 * ((p2.x - p1.x) * (p3.y - p2.y) - (p3.x - p2.x) * (p2.y - p1.y)));

        var y = (w - 2 * x * (p2.x - p1.x)) / (2 * (p2.y - p1.y));

        var v = (z - 2 * x * (p3.x - p2.x)) / (2 * (p3.y - p2.y));
        y = (y + v) / 2;

        return {
            x: Math.floor(x),
            y: Math.floor(y),
            c:'#ff3366'
        };
    }

    function getTrilateration(pa, pb, pc) {
        var S = (Math.pow(pc.x, 2.) - Math.pow(pb.x, 2.) + Math.pow(pc.y, 2.) - Math.pow(pb.y, 2.) + Math.pow(pb.r, 2.) - Math.pow(pc.r, 2.)) / 2.0;
        var T = (Math.pow(pa.x, 2.) - Math.pow(pb.x, 2.) + Math.pow(pa.y, 2.) - Math.pow(pb.y, 2.) + Math.pow(pb.r, 2.) - Math.pow(pa.r, 2.)) / 2.0;
        var y = ((T * (pb.x - pc.x)) - (S * (pb.x - pa.x))) / (((pa.y - pb.y) * (pb.x - pb.x)) - ((pc.y - pb.y) * (pb.x - pa.x)));
        var x = ((y * (pa.y - pb.y)) - T) / (pb.x - pa.x);
        console.log('TRILATERATION', {x:x, y:y})
        return {
            x: x,
            y: y,
            c:'#ff3366'
        };
    }

    window.getCoordinate = getCoordinate;
    window.debugGetCoordinate = debugGetCoordinate;

    return {
        getPosition: getPosition,
        getCoordinate: getCoordinate,
        debugGetCoordinate: debugGetCoordinate,
    }
});
