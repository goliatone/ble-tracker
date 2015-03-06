define('nvd3.scatterplot', function(require){

    require('d3');
    require('nvd3');

    var updates = {};
    var data = [
        {key:'333::1', values:[]},
        {key:'333::2', values:[]},
        {key:'333::3', values:[]},
        {key:'444::1', values:[]},
        {key:'444::2', values:[]},
        {key:'444::3', values:[]},
    ];

    var getBeaconHolder = function(id){
        if(updates[id]) return data[updates[id]].values;
        var index = data.push({key:id, values:[]});
        updates[id] = index - 1;
        return data[updates[id]].values;
    };

    var handlePayloadUpdate = function(payload){
        payload.beacons.forEach(function(b){
            var id = b.major + '::' + b.minor;
            var d = getBeaconHolder(id);
            console.log(d)
            d.push(b.distance * 100);
        });
        updateGraph(data);
    };

    // create the chart
    data = initialData(data.length, 1);

    var chart;
    nv.addGraph(function() {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .useVoronoi(true)
            .color(d3.scale.category10().range())
            .duration(300);

        chart.dispatch.on('renderEnd', function(){
            console.log('render complete');
        });

        chart.xAxis.tickFormat(d3.format('.02f'));

        chart.yAxis.tickFormat(d3.format('.02f'));

        chart.tooltipContent(function(key) {
            return '<h2>' + key + '</h2>';
        });

        d3.select('#test1 svg')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) {
            ('New State:', JSON.stringify(e));
        });
        return chart;
    });

    window.udpateGraph = function(data) {
        d3.select('#test1 svg')
            .datum(data)
            .transition()
            .duration(500)
            .call(chart);
        nv.utils.windowResize(chart.update);
    };

    window.addPointToScatterPlot = function(point){
        var dataPoint = getDataPoint(point);
        updateGraph([dataPoint]);
    };

    function initialData(groups, points) { //# groups,# points per group
        var random = d3.random.normal();
        for (i = 0; i < groups; i++) {
            for (j = 0; j < points; j++) {
                data[i].values.push(getDataPoint(random(), random()));
            }
        }
        return data;
    }

    function getDataPoint(x, y){
        return {
            x: x,
            y: y,
            size: Math.round(Math.random() * 100) / 100,
            shape: "circle"
        };
    }



    return {
        addPointToScatterPlot:addPointToScatterPlot
    }
});
