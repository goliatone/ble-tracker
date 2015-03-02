define('floormap', function(require){
    var d3 = require('d3');

    require('scatterplot');

    var IMG_WIDTH = 2196,
        IMG_HEIGTH = 1326;

    var xscale = d3.scale.linear()
               .domain([0, IMG_WIDTH])//input
               .range([0, IMG_WIDTH * 0.5]), //output
        yscale = d3.scale.linear()
               .domain([0, IMG_HEIGTH ]) //input
               .range([0, IMG_HEIGTH * 0.5]), //output

        map = d3.floorplan().xScale(xscale).yScale(yscale),
        imagelayer = d3.floorplan.imagelayer(),
        plotlayer = d3.floorplan.scatterplot(),
        mapdata = {};

    window.pl = plotlayer;

    mapdata[imagelayer.id()] = [{
        url: '/images/fc_22_ca.png',
        x: 0,
        y: 0,
        width: IMG_WIDTH,
        height: IMG_HEIGTH,
     }];

    mapdata[plotlayer.id()] = [{
        x: 1900, y: 307, c:'red'
    }];

    map.addLayer(imagelayer)
       .addLayer(plotlayer);

    d3.select("#map").append("svg")
    .attr("width", IMG_WIDTH * 0.5)
        .attr("height", IMG_HEIGTH * 0.5)
        .datum(mapdata)
        .call(map);
    console.log('MAP', "width", IMG_WIDTH * 0.5, "height", IMG_HEIGTH * 0.5);
});
