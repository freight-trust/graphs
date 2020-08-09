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
// we set this default trust in the protcol parameters
var defaultTrust = 0.288;
var transferredValueMultiplier = 2.6;
var transferredValueSplit = 0.2;

var individual = function (id, honestyCoeff) {
  this.id = id;
  this.value = 10.0;
  this.relations = Array.apply(null, Array(stakingpoolSize)).map(
    Number.prototype.valueOf,
    defaultTrust
  );
  this.honesty = honestyCoeff;
  this.sumRelations = function () {
    return this.relations.reduce(function (
      previousValue,
      currentValue,
      currentIndex,
      array
    ) {
      return previousValue + currentValue;
    },
    0);
  };
};

var initializeIndividuals = function (honestyCoeff, stakingpoolSize) {
  var individuals = [];
  for (var i = 0; i < stakingpoolSize; ++i) {
    individuals.push(new individual(i, honestyCoeff));
  }
  return individuals;
};

var computeRelation = function (sourceIndex, targetIndex, individuals) {
  var sourceIndividual = individuals[sourceIndex];
  var targetIndividual = individuals[targetIndex];
  var trustValue = sourceIndividual.relations[targetIndex]; // should be the same as
  // targetIndividual.relations[sourceIndex]
  var transferredValue =
    sourceIndividual.relations[targetIndex] *
    sourceIndividual.value *
    transferredValueMultiplier;
  var honestyTest = targetIndividual.honesty >= Math.random();
  if (honestyTest) {
    return {
      sourceValueIncrease:
        transferredValue * transferredValueSplit -
        sourceIndividual.value * (1 - transferredValueSplit),
      targetValueIncrease: transferredValue * (1 - transferredValueSplit),
      newTrustValue: (trustValue * (1 + 0.1)) / (1 + trustValue * 0.1), //S-curve
    };
  } else {
    return {
      sourceValueIncrease:
        -sourceIndividual.value * (1 - transferredValueSplit),
      targetValueIncrease: transferredValue,
      newTrustValue: (trustValue * (1 + trustValue * 0.1)) / (1 + 0.1),
    };
  }
};

var runSimulation = function (honestyCoeff, stakingpoolSize, nbIterations) {
  var individuals = initializeIndividuals(honestyCoeff, stakingpoolSize);
  var individualsArchive = [individuals];
  for (var i = 0; i < nbIterations; ++i) {
    var relationSourceIndex = Math.floor(Math.random() * stakingpoolSize);
    var relationTargetIndex = Math.floor(Math.random() * stakingpoolSize);
    if (relationSourceIndex === relationTargetIndex) {
      continue;
    }
    var newRelations = computeRelation(
      relationSourceIndex,
      relationTargetIndex,
      individuals
    );
    individuals[relationSourceIndex].value += newRelations.sourceValueIncrease;
    individuals[relationSourceIndex].relations[relationTargetIndex] =
      newRelations.newTrustValue;
    individuals[relationTargetIndex].value += newRelations.targetValueIncrease;
    individuals[relationTargetIndex].relations[relationSourceIndex] =
      newRelations.newTrustValue;
    individualsArchive.push(individuals);
  }
  return individualsArchive;
};
