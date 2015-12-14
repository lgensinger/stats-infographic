// JavaScript Document

function main() {

    //chart size
    var w = window.innerWidth * .80;
    var h = window.innerHeight * .10;
    
    //spacing
    var left = w * 0.20;
    var wPadding = w * .05;
    var hPadding = (h / 4) * 0.01;
    
    //add innovation charts 
    stackBarCharts("innovation");
    
    //add market charts
    ringCharts("market");
    
    //add quality charts
    barCharts("quality");

function barCharts(sectionName) {
        
    //bind data
    d3.json("data.json", function(data) {
    
        //container
        var container = d3.select("#" + sectionName)
            .selectAll(".chartContainer")
            .data(data)
            .enter()
            .append("div")
            .filter(function(d) { return d.section == sectionName; })
            .attr({
            
                class: "chartContainer"
                
                })
                
            .each(function(d) {
                
                //title
                d3.select(this)
                .append("h4")
                .text(function(d) { return d.title; });
                
                //svg
                d3.select(this)
                .append("svg")
                .attr({
                
                    width: w,
                    height: h,
                    
                    })
                    
                .each(function(d) {
                
                    //bar scales
                    var xScale = d3.scale.linear()
                        .domain([0, d3.max(d.info, function(datum) { return datum.value; })])
                        .range([0, w - wPadding - left]);

                    var yScale = d3.scale.ordinal()
                        .domain(d3.range(d.info.length))
                        .rangeRoundBands([0, h], hPadding);
                    
                    //bar sizing
                    var bWidth = function(datum) { return xScale(datum.value); };
                    var bHeight = yScale.rangeBand();
                    var labelY = function(datum, i) { return yScale(i) + ((bHeight / 3) * 2); };
                
                    //bars
                    d3.select(this)
                    .selectAll("rect")
                    .data(d.info)
                    .enter()
                    .append("rect")
                    .attr({
                    
                        x: left,
                        y: function(datum, i) { return yScale(i); },
                        width: bWidth,
                        height: bHeight,
                        fill: function(datum) { return datum.color; }
                        
                        });
                        
                    //value label
                    d3.select(this)
                    .selectAll("text.value")
                    .data(d.info)
                    .enter()
                    .append("text")
                    .text(function(datum) { return datum.value; })
                    .attr({
                    
                        x: function(datum) { return xScale(datum.value) + (wPadding / 4) + left; },
                        y: labelY,
                        class: "value"
                        
                        });
                        
                    //category label
                    d3.select(this)
                    .selectAll("text.name")
                    .data(d.info)
                    .enter()
                    .append("text")
                    .text(function(datum) { return datum.name; })
                    .attr({
                    
                        x: 0,
                        y: labelY,
                        class: "name",
                        fill: function(datum) { return datum.color; }
                        
                        });
                            
                    });
                    
                });
        
        });
        
    };
    
function ringCharts(sectionName) {

    //bind data
    d3.json("data.json", function(data) {
    
        //container
        var container = d3.select("#" + sectionName)
            .selectAll(".chartContainer")
            .data(data)
            .enter()
            .append("div")
            .filter(function(d) { return d.section == sectionName; })
            .attr({
            
                class: "chartContainer"
                
                })
                
            .each(function(d) {
                
                //title
                d3.select(this)
                    .append("h4")
                    .text(function(d) { return d.title; });
                                
                //svg
                var sWidth = w * 0.60;
                var sHeight = w * 0.40;
                var svg = d3.select(this)
                    .append("svg")
                    .attr({
                
                        width: sWidth,
                        height: sHeight,
                    
                        });
                
                //pie layout
                var values = d.info.map(function(obj) { return obj.value; });
                var colors = d.info.map(function(obj) { return obj.color; });
                var names = d.info.map(function(obj) { return obj.name; });
                var pie = d3.layout.pie(values)
                    .sort(null);
                var oRad = sWidth * 0.28;
                var iRad = oRad * 0.68;
                var arc = d3.svg.arc()
                    .innerRadius(iRad)
                    .outerRadius(oRad);
                
                //arcs
                var arcs = svg.selectAll("g.arc")
                    .data(pie(values))
                    .enter()
                    .append("g")
                    .attr({
                
                        class: "arc",
                        transform: "translate(" + (sWidth / 2) + ", " + (sHeight / 2) + ")"
                    
                        })
                    
                //path
                arcs.append("path")
                .attr({
            
                    fill: function(datum, i) { return colors[i]; },
                    d: arc
        
                    });
                    
                //value label
                arcs.append("text")
                    .text(function(datum, i) { return values[i]; })
                    .attr({
                    
                        transform: function(datum) { return "translate(" + arc.centroid(datum) + ")"; },
                        class: "value"
                    
                    })
                    .style("text-anchor", "middle");
                    
                //category label
                arcs.append("text")
                    .text(function(datum, i) { return names[i]; })
                    .attr({
                    
                        transform: function(datum) {
                            var c = arc.centroid(datum);
                            var x = c[0];
                            var y = c[1];
                            var h = Math.sqrt(x*x + y*y);
                            var rLabel = (oRad * 0.10) + oRad;
                            
                            return "translate(" + (x/h * rLabel) + ", " + (y/h * rLabel) + ")"; },
                        fill: function(datum, i) { return colors[i]; },
                        class: "name"
                        
                        })
                        
                    .style("text-anchor", function(datum) { return (datum.endAngle + datum.startAngle)/2 > Math.PI ? 
                                "end" : "start"; });
                            
            });
                
        });         

    };
    
function stackBarCharts(sectionName) {

    //bind data
    d3.json("data.json", function(data) {
    
        //container
        var container = d3.select("#" + sectionName)
            .selectAll(".chartContainer")
            .data(data)
            .enter()
            .append("div")
            .filter(function(d) { return d.section == sectionName; })
            .attr({
            
                class: "chartContainer"
                
                })
                
            .each(function(d) {
                
                //title
                d3.select(this)
                .append("h4")
                .text(function(d) { return d.title; });
                
                //svg
                var svg = d3.select(this)
                    .append("svg")
                    .attr({
                
                        width: w,
                        height: h,
                    
                        });
                        
                //stack format
                var dataStack = d.info.map(function(datum, i) { return [{ x:i, y:datum.value, color:datum.color }]; });
                var stack = d3.layout.stack();
                stack(dataStack);
                console.log(dataStack);
                //Set up scales
                var xScale = d3.scale.ordinal()
                    .domain(d3.range(dataStack[0].length))
                    .rangeRoundBands([0, w], 0.05);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(dataStack, function(datum) { return d3.max(datum, function(datum) { return datum.y0 + datum.y; });})])
                    .range([0, h]);

                // Add a group for each row of data
                var groups = svg.selectAll("g")
                    .data(dataStack)
                    .enter()
                    .append("g")
                    .style("fill", function(datum, i) { return datum[0].color; });

                // Add a rect for each data value
                var rects = groups.selectAll("rect")
                    .data(function(datum) { return datum; })
                    .enter()
                    .append("rect")
                    .attr("x", function(datum, i) { return xScale(i); })
                    .attr("y", function(datum) { return yScale(datum.y0); })
                    .attr("height", function(datum) { return yScale(datum.y); })
                    .attr("width", xScale.rangeBand());
                
            });
            
    });
    
};
    
};

main();