define('floormap', function(require){
    var d3 = require('d3');

    require('scatterplot');

    var IMG_WIDTH = 2196,
        IMG_HEIGTH = 1326,
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

    var plotlayer = d3.floorplan.scatterplot({
            keySelector:function(d){
                return d.id;
            }
        });

    var mapdata = {};

    window.hm = heatmap;
    window.pl = plotlayer;

    mapdata[imagelayer.id()] = [{
        url: '/images/fc_22_ca_2.png',
        x: 0,
        y: 0,
        width: IMG_WIDTH,
        height: IMG_HEIGTH,
     }];

    mapdata[plotlayer.id()] = [
        // {x: 1900, y: 307, c:'red', id:'pepe'}
    ];

    // mapdata[heatmap.id()] =



    map.addLayer(imagelayer)
        .addLayer(heatmap)
        .addLayer(plotlayer);

    d3.select("#map")
        .append("svg")
        // .attr("width", "100%")
        // .attr("height", "100%")
        .attr("width", IMG_WIDTH * SCALE)
        .attr("height", IMG_HEIGTH * SCALE)

        // .attr("viewBox", [0,0,IMG_WIDTH * SCALE, IMG_HEIGTH * SCALE].join(','))
        // .attr("preserveAspectRatio", "xMidYMid meet")
        .datum(mapdata)
        .call(map);
});
