define('floormap', function(require){
    var d3 = require('d3');

    require('scatterplot');
    require('d3.floorplan.heatmap');

    var IMG_WIDTH = 4800,
        IMG_HEIGTH = 3184,
        SCALE = .35;

    var xscale = d3.scale.linear()
               .domain([0, IMG_WIDTH])//input
               .range([0, IMG_WIDTH * SCALE]); //output

    var yscale = d3.scale.linear()
               .domain([0, IMG_HEIGTH ]) //input
               .range([0, IMG_HEIGTH * SCALE]); //output

    var map = d3.floorplan().xScale(xscale).yScale(yscale);

    var imagelayer = d3.floorplan.imagelayer();

    var heatmap = d3.floorplan.heatmap();

    var o = {
        plotlayer:{
            keySelector:function(d){
                return d.id;
            }
        }
    };

    o.plotlayer.keySelector = undefined;
    var plotlayer = d3.floorplan.scatterplot({
            keySelector:o.plotlayer.keySelector
        });

    var mapdata = {};

    window.hm = heatmap;
    window.pl = plotlayer;

    mapdata[imagelayer.id()] = [{
        url: '/images/NY15-4th-floor.png',
        x: 0,
        y: 0,
        width: IMG_WIDTH,
        height: IMG_HEIGTH,
     }];

    mapdata[plotlayer.id()] = [
        // {x: 1900, y: 307, c:'red', id:'pepe'}
    ];

    mapdata[heatmap.id()] = {
        // "binSize": 150,
        // "map": [
        //     {
        //         "x": 1674,
        //         "y": 51,
        //         "value": 67.90988380089402
        //     },
        //     {
        //         "x": 1674,
        //         "y": 201,
        //         "value": 5.695839156396687
        //     },
        //     {
        //         "x": 1674,
        //         "y": 351,
        //         "value": 91.9619612628594
        //     },
        //     {
        //         "x": 1674,
        //         "y": 501,
        //         "value": 70.47435906715691
        //     },
        //     {
        //         "x": 1824,
        //         "y": 51,
        //         "value": 75.90363819617778
        //     },
        //     {
        //         "x": 1824,
        //         "y": 201,
        //         "value": 56.25416536349803
        //     },
        //     {
        //         "x": 1824,
        //         "y": 351,
        //         "value": 63.405701192095876
        //     },
        //     {
        //         "x": 1824,
        //         "y": 501,
        //         "value": 4.852862050756812
        //     },
        //     {
        //         "x": 1974,
        //         "y": 51,
        //         "value": 4.322382831014693
        //     },
        //     {
        //         "x": 1974,
        //         "y": 201,
        //         "value": 14.176998031325638
        //     },
        //     {
        //         "x": 1974,
        //         "y": 351,
        //         "value": 11.433634930290282
        //     },
        //     {
        //         "x": 1974,
        //         "y": 501,
        //         "value": 48.29409385565668
        //     }
        // ]
    };



    map.addLayer(imagelayer)
        .addLayer(heatmap)
        .addLayer(plotlayer);

    d3.select("#map")
        .append("svg")
        // .attr("width", "100%")
        // .attr("height", "100%")
        // .attr("width", IMG_WIDTH * SCALE)
        // .attr("height", IMG_HEIGTH * SCALE)

        .attr("viewBox", [0,0,IMG_WIDTH * SCALE, IMG_HEIGTH * SCALE].join(','))
        .attr("preserveAspectRatio", "xMidYMid meet")
        .datum(mapdata)
        .call(map);
});
