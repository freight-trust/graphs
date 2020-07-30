"use strict";

var circularGraph = function(targetDiv, parameters) {

    var diameter = 100; //default diameter
    var caption = null;
    if (parameters) {
        if (parameters.diameter) {
            diameter = parameters.diameter;
        }
        caption = parameters.caption;
    }
    var radius = diameter / 2;
    var margin = 30;

    // Generates a tooltip for a SVG circle element based on its ID
    this.addTooltip = function(circle) {
        var x = parseFloat(circle.attr("cx"));
        var y = parseFloat(circle.attr("cy"));
        var r = parseFloat(circle.attr("r"));
        var text = circle.attr("id");

        var tooltip = d3.select(targetDiv).select("#plot")
            .append("text")
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("dy", -r * 2)
            .attr("id", "tooltip");

        var offset = tooltip.node().getBBox().width / 2;

        if ((x - offset) < -radius) {
            tooltip.attr("text-anchor", "start");
            tooltip.attr("dx", -r);
        }
        else if ((x + offset) > (radius)) {
            tooltip.attr("text-anchor", "end");
            tooltip.attr("dx", r);
        }
        else {
            tooltip.attr("text-anchor", "middle");
            tooltip.attr("dx", 0);
        }
    }

    // Initialization:
    this.svg = d3.select("body").select(targetDiv)
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter);

    this.svg.append("text")
        .attr("x", (diameter / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(caption);

    // create plot area within svg image
    this.plot = this.svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + radius + ", " + radius + ")");

    // Draws an arc diagram for the provided undirected graph
    this.drawGraph = function(graph) {

        // fix graph links to map to objects instead of indices
        graph.links.forEach(function(d, i) {
            d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
            d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
        });

        // calculate node positions
        this.circleLayout(graph.nodes);

        // draw edges first
        this.drawLinks(graph.links);
        // drawCurves(graph.links);

        // draw nodes last
        this.drawNodes(graph.nodes);
    }

    // Calculates node locations
    this.circleLayout = function(nodes) {
        // sort nodes by group
        nodes.sort(function(a, b) {
            return a.group - b.group;
        });

        // use to scale node index to theta value
        var scale = d3.scale.linear()
            .domain([0, nodes.length])
            .range([0, 2 * Math.PI]);

        // calculate theta for each node
        nodes.forEach(function(d, i) {
            // calculate polar coordinates
            var theta  = scale(i);
            var radial = radius - margin;

            // convert to cartesian coordinates
            d.x = radial * Math.sin(theta);
            d.y = radial * Math.cos(theta);
        });
    }

    // Draws nodes with tooltips
    this.drawNodes = function(nodes) {
        // used to assign nodes color by group
        var color = d3.scale.category20();

        var circles = d3.select(targetDiv).select("#plot").selectAll(".node")
            .data(nodes);

        circles.attr("cx", function(d, i) { return d.x; })
            .attr("cy", function(d, i) { return d.y; });

        circles.enter()
            .append("circle")
            .attr("class", "node")
            .attr("id", function(d, i) { return d.name; })
            .attr("cx", function(d, i) { return d.x; })
            .attr("cy", function(d, i) { return d.y; })
            .attr("r", 5)
            .style("fill",   function(d, i) { return color(d.group); })
            .on("mouseover", function(d, i) { addTooltip(d3.select(this)); })
            .on("mouseout",  function(d, i) { d3.select("#tooltip").remove(); });

         circles.exit().remove();

    }

    // Draws straight edges between nodes
    this.drawLinks = function(links) {
        var lines = d3.select(targetDiv).select("#plot").selectAll(".link").data(links, function(d) {
            return d.source.id* 1e6 + d.target.id;
        });

        lines.attr("stroke-width", function(d) {return d.value*50-15; })
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        lines.enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke-width", function(d) {return d.value*50-15; })
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        lines.exit().remove();
    }

    // Draws curved edges between nodes
    this.drawCurves = function (links) {
        // remember this from tree example?
        var curve = d3.svg.diagonal()
            .projection(function(d) { return [d.x, d.y]; });

        d3.select(targetDiv).select("#plot").selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", curve);
    }

    this.update = function(data) {
        this.drawGraph(data);
    }
}