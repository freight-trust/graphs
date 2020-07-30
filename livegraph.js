/**
 *    Copyright 2020 FreightTrust and Clearing Corporation

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
"use strict";

function liveGraph(targetDiv, data, parameters) {

    var canvasHeight = 500;
    var canvasWidth = 500;
    var padding = 50;
    var plotType = 'linear';
    var caption = null;

    if (parameters) {
        if (parameters.plotType) {
            plotType = parameters.plotType;
        }
        caption = parameters.caption;
    }
    this.svg = d3.select(targetDiv).append("svg")
                .attr("width", canvasWidth)
                .attr("height", canvasHeight);

    this.svg.append("text")
        .attr("x", (canvasWidth / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(caption);

    var xScale = d3.scale.linear()
                    .domain([0, 100])
                    .range([padding, canvasWidth - padding * 2]);

    var yScale;
    if (plotType === 'semilog') {
        yScale = d3.scale.log()
                    .domain([0, 500])
                    .range([canvasHeight - padding, padding]);
    } else if (plotType === 'linear') {
        yScale = d3.scale.linear()
                    .domain([0, 500])
                    .range([canvasHeight - padding, padding]);
    } else {
        throw "Unknown scale type " + plotType;
    }

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickValues(d3.range(0, 100, 25));;

    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (canvasHeight - padding) +")")
        .call(xAxis);

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding +",0)")
        .call(yAxis);

    /*
     * Member function to update the graph when new data ticks in
     */
    this.update = function(data, xVar, yVar) {

        xScale.domain([0, d3.max(data, function(d) {
            return d[xVar]; })]);
        yScale.domain([d3.min(data, function(d) {
            return d[yVar]; }),
                      d3.max(data, function(d) {
            return d[yVar]; })]);
        this.svg.select(".x.axis")
            .call(xAxis);

        this.svg.select(".y.axis")
            .call(yAxis);

        //Don't show tick labels if there are too many of them
        if(yScale.ticks().length > 150) {
            this.svg.select(".y.axis")
                    .call(yAxis).selectAll("text").remove();
        };

        var circle = this.svg.selectAll("circle").data(data, function key(d) {return d[xVar];});

        circle.attr("cx", function(d) {
                return xScale(d[xVar]);
            })
            .attr("cy", function(d) {
                return yScale(d[yVar]);
            })

        circle.enter()
            .append("circle")
            .attr("cx", function(d) {
                return xScale(d[xVar]);
            })
            .attr("cy", function(d) {
                return yScale(d[yVar]);
            })
        .transition()
        .duration(1000)
        .each("start", function() {
            d3.select(this)
                .attr("class", "datadotsmall")
                .attr("r", 2);
        })
        .each("end", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("class", "datadotlarge")
                .attr("r", 5);
        });

        circle.exit().remove();
    }
}