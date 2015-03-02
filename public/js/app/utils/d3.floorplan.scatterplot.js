define('scatterplot', function(require){
    var d3 = require('d3');
    require('floorplan');

    d3.floorplan.scatterplot = function() {
        var x = d3.scale.linear(),
        y = d3.scale.linear(),
        name = "scatterplot",
        _svg = null,
        id = "fp-scatter-plot-" + new Date().valueOf(),
        pointFilter = function(d) { return d.points; };

        function scatterplot(g) {
            g.each(function(data) {
                if (!data) return;
                console.log('DATA', data);

                _svg = d3.select(this);
                return scatterplot.refresh(data);
            });
        }

        scatterplot.refresh = function(data, keySelector){
            //We should filter data, check if we already have the
            //points, if so, update values, else
            //add them to plot
            var dots = _svg.selectAll("scatter-dots")
                    .data(data, keySelector);

            dots.exit().remove();

            dots.enter().append("svg:circle")
                .attr("cx", function (d, i) {
                    console.log('CIRCLE', d.x, d.y)
                     return x(d.x);
                 })
                .attr("cy", function (d) {
                    return y(d.y);
                })
                .attr('fill', function(d){
                    return d.c ? d.c : 'red';
                })
                .attr("r", 10);
        };

        scatterplot.xScale = function(scale) {
            if (! arguments.length) return x;
            x = scale;
            return scatterplot;
        };

        scatterplot.yScale = function(scale) {
            if (! arguments.length) return y;
            y = scale;
            return scatterplot;
        };

        scatterplot.id = function() {
            return id;
        };

        scatterplot.title = function(n) {
            if (! arguments.length) return name;
            name = n;
            return scatterplot;
        };

        scatterplot.pointFilter = function(fn) {
            if (! arguments.length) return pointFilter;
            pointFilter = fn;
            return scatterplot;
        };

        return scatterplot;
    };

});
