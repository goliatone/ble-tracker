define('sparkle', function(require){
    require('css!sparkle.css');
    //http://bl.ocks.org/d3noob/4433087
    //check how to close fill
    var d3 = require('d3');
    var Ractive = require('ractive');
    var template = require('text!sparkle.html');

    var Sparkle = Ractive.extend({
        template: template,
        append:true,
        init: function(o){
            this.observe('values', function(n, o){
                if(n === undefined && o === undefined) return;
                console.log('UPDATE VALUES', n);
                // var u = this.get('updates').concat(n);
                this.merge('updates', n);
                this.redraw();
            });

            var id = '#graph-1',
                width = 400,
                height = 100,
                interpolation = 'basis',
                animate = true,
                updateDelay = 1000,
                transitionDelay = 280;

            var graph = d3.select(id)
                .append("svg:svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("preserveAspectRatio", "xMidYMid meet");

            // var dataTwo = this.get('updates');
            var dataTwo = [33, 76, 67, 74, 32, 82, 62, 1, 78, 4, 13, 88, 61, 26, 58, 42, 79, 69, 3, 19, 10, 91, 94, 20, 27, 8, 51, 87, 85, 65, 17, 77, 35, 37, 93, 36, 60, 63, 39, 73, 43, 75, 9, 66, 25, 49, 97, 90, 47, 70, 18, 41, 50, 34, 53, 23, 30, 92, 14, 84, 16, 95, 28, 31, 96, 68, 80, 21, 72, 99, 15, 83, 6, 64, 59, 54, 86, 12, 55, 71, 7, 22, 52, 24, 5, 29, 56, 2, 100, 98, 48, 11, 40, 57, 45, 81, 89, 38, 46, 44];
            this.set('updates', dataTwo);
            var x = d3.scale.linear().domain([0, 48]).range([-5, width]);
            var y = d3.scale.linear().domain([0, 100]).range([0, height]);

            var line = d3.svg.line()
                .x(function(d,i) {
                    return x(i);
                })
                .y(function(d) {
                    return y(d);
                })
                .interpolate(interpolation)

            graph.append("svg:path").attr("d", line(dataTwo));

            // function redrawWithAnimation() {
            //     graph.selectAll("path")
            //         .data([dataTwo])
            //         .attr("transform", "translate(" + x(1) + ")")
            //         .attr("d", line)
            //         .transition()
            //         .ease("linear")
            //         .duration(transitionDelay)
            //         .attr("transform", "translate(" + x(0) + ")");
            // }

            this.x = x;
            this.line = line;
            this.graph = graph;
            this.transitionDelay = transitionDelay;

            // setInterval(function() {
            //    // var v = dataTwo.shift();
            //    dataTwo.push(v);
            //    redrawWithAnimation();
            // }, updateDelay);
        },
        redraw: function(){
            var data = this.get('udpates');
            var dataTwo = this.get('updates');
            // var dataTwo = [33, 76, 67, 74, 32, 82, 62, 1, 78, 4, 13, 88, 61, 26, 58, 42, 79, 69, 3, 19, 10, 91, 94, 20, 27, 8, 51, 87, 85, 65, 17, 77, 35, 37, 93, 36, 60, 63, 39, 73, 43, 75, 9, 66, 25, 49, 97, 90, 47, 70, 18, 41, 50, 34, 53, 23, 30, 92, 14, 84, 16, 95, 28, 31, 96, 68, 80, 21, 72, 99, 15, 83, 6, 64, 59, 54, 86, 12, 55, 71, 7, 22, 52, 24, 5, 29, 56, 2, 100, 98, 48, 11, 40, 57, 45, 81, 89, 38, 46, 44];
            var v = dataTwo.shift();
            dataTwo.push(v);
            this.graph.selectAll("path")
                    .data([data])
                    // .data([dataTwo])
                    .attr("transform", "translate(" + this.x(1) + ")")
                    .attr("d", this.line)
                    .transition()
                    .ease("linear")
                    .duration(this.transitionDelay)
                    .attr("transform", "translate(" + this.x(0) + ")");
        },
        data:{
            updates: [],
            targetId: 'graph-1',
            width:400,
            height:100,
            interpolation: "basis",
            animate: true

        }

    });

    Ractive.components['sparkle'] = Sparkle;

    return Sparkle;
});
