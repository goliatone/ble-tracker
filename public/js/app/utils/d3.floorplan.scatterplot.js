define('scatterplot', function(require){
    var d3 = require('d3'),
        extend = require('extend');

    //We need to require floorplan plugin
    require('floorplan');

    var DEFAULTS = {
        keySelector: undefined,
        name:'scatterplot'
    };

    var scatterplot = function(options) {
        options = extend({}, DEFAULTS, options);

        var x = d3.scale.linear(),
            y = d3.scale.linear(),
            _svg = null,
            id = 'fp-scatter-plot-' + new Date().valueOf();

        function ScatterPlot(g) {
            g.each(function(data) {
                if (!data) return;
                _svg = d3.select(this);
                return ScatterPlot.refresh(data);
            });
        }

        ScatterPlot.refresh = function(data, keySelector){
            keySelector = keySelector || options.keySelector;

            //We should filter data, check if we already have the
            //points, if so, update values, else
            //add them to plot
            var dots = _svg.selectAll('circle')
                    .data(data, keySelector);

            dots.exit().remove();

            dots.enter()
                .append('circle')

            dots.attr('cx', function (d, i) {
                     return x(d.x);
                 })
                .attr('cy', function (d) {
                    return y(d.y);
                })
                .attr('fill', function(d){
                    return d.c ? d.c : 'red';
                })
                .attr('r', function(d){
                    return x( d.r ? dr : 10);
                });
        };

        ScatterPlot.xScale = function(scale) {
            if (! arguments.length) return x;
            x = scale;
            return ScatterPlot;
        };

        ScatterPlot.yScale = function(scale) {
            if (! arguments.length) return y;
            y = scale;
            return ScatterPlot;
        };

        ScatterPlot.id = function() {
            return id;
        };

        ScatterPlot.title = function(n) {
            if (! arguments.length) return options.name;
            options.name = n;
            return ScatterPlot;
        };

        return ScatterPlot;
    };

    d3.floorplan.scatterplot = scatterplot;

});
