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

var dataset = [];
var valueVsHonestyGraph = new liveGraph("#valueVsHonestyGraph", dataset, {
  plotType: "semilog",
  caption: "Total Staking Value vs. Pool Honesty",
});
var trustVsHonestyGraph = new liveGraph("#trustVsHonestyGraph", dataset, {
  caption: "Total Trust vs. Pool Honesty",
});
var circularGraphs = [];
var nbBuckets = 4;
for (var i = 0; i < nbBuckets; ++i) {
  var divName = "circularGraph" + i;
  var div = d3.select("body").append("div");
  div.attr("id", divName).attr("class", "smallgraph");
  circularGraphs[i] = new circularGraph("#" + divName, {
    diameter: 250,
    caption:
      "Pool Honesty: " +
      (100 * i) / nbBuckets +
      "-" +
      (100 * (i + 1)) / nbBuckets +
      "%",
  });
}

var stakingpoolSize = 10;
d3.select("#stakingpoolSize").on("input", function () {
  stakingpoolSize = +this.value;
  d3.select("#stakingpoolSize-value").text(stakingpoolSize);
});

var simulationSpeed = 10;
var interval;
d3.select("#simulationSpeed").on("input", function () {
  simulationSpeed = +this.value;
  d3.select("#simulationSpeed-value").text(simulationSpeed);
  clearInterval(interval);
  interval = setInterval(executeSimulation, 1000 / simulationSpeed);
});

var nbIterations = 200;
d3.select("#nbIterations").on("input", function () {
  nbIterations = +this.value;
  d3.select("#nbIterations-value").text(nbIterations);
});

var executeSimulation = function () {
  var honestyCoeff = Math.random();
  var fullResult = runSimulation(honestyCoeff, stakingpoolSize, nbIterations);
  var result = fullResult[fullResult.length - 1];
  var totalValue = result.reduce(function (
    previousValue,
    currentValue,
    currentIndex,
    array
  ) {
    return previousValue + currentValue.value;
  },
  0);
  var totalTrust = result.reduce(function (
    previousValue,
    currentValue,
    currentIndex,
    array
  ) {
    return previousValue + currentValue.sumRelations();
  },
  0);
  var d = {
    honestyCoeff: honestyCoeff * 100,
    totalValue: totalValue,
    totalTrust: totalTrust,
  };
  dataset.push(d);
  if (dataset.length > 300) {
    dataset.shift();
  }
  valueVsHonestyGraph.update(dataset, "honestyCoeff", "totalValue");
  trustVsHonestyGraph.update(dataset, "honestyCoeff", "totalTrust");

  var relationList = result.reduce(function (
    previousValue,
    currentValue,
    currentIndex
  ) {
    return previousValue.concat(
      currentValue.relations.map(function (d, i) {
        return { source: currentIndex, target: i, value: d };
      })
    );
  },
  []);
  var circularGraphData = { nodes: result, links: relationList };
  circularGraphs[Math.floor(honestyCoeff * nbBuckets)].update(
    circularGraphData
  );
};

interval = setInterval(executeSimulation, 1000 / simulationSpeed);

function changeCSS(cssFile, cssLinkIndex) {
  var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
  oldlink.href = cssFile;
}
