define('d3.heatmap.grid', function(require){

    //TODO: We need to access the geometry of the monitored area dynamically
    var container = {
        topleft:{
            x: 1664,
            y: 51
        },
        topright:{
            x: 2125,
            y: 51
        },
        bottomright:{
            x: 2074,
            y: 658
        },
        bottomleft:{
            x: 1675,
            y: 658
        }
    };


    container.binSize = 150;
    //TODO: We need to normalize the area to cover- find container.topright.x > container.bottomright.x?
    container.xBins = Math.round( (container.topright.x - container.topleft.x ) / container.binSize);
    container.yBins = Math.round( (container.bottomleft.y - container.topleft.y ) / container.binSize);

    container.grid = {};
    container.points = [];
    var p;

    for(var i=0; i < container.xBins; i++){
        container.grid[i] = {};
        for(var j=0; j < container.yBins; j++){
            p = {
                x: container.topleft.x + (container.binSize * i) ,
                y: container.topleft.y + (container.binSize * j),
                value: Math.random() * 100
            };
            container.grid[i][j] = p;
            container.points.push(p);

        }
    }
    // window.container = container;
    console.log(JSON.stringify(container.points, null, 4));

    return container;
});
