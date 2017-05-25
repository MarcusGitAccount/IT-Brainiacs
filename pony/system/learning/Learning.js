'use strict';

const synaptic = require('synaptic');
const constants = require('./constants');

const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Trainer = synaptic.Trainer;

const input = new Layer(constants.INPUT_LAYERS);
const hidden = new Layer(constants.OUTPUT_LAYERS * constants.INPUT_LAYERS);
const output = new Layer(constants.OUTPUT_LAYERS);

const _testData = Symbol('_testData');
/*
const trainingSet = [
  {input: [1, 0, 1, 1, 1, 1], output: [0]},
  {input: [0, 1], output: [1]},
  {input: [1, 1], output: [1]},
  {input: [0, 0], output: [1]}
];
*/
input.project(hidden);
hidden.project(output);

const network = new Network({
  input: input,
  hidden: [hidden],
  output: output
});

const trainer = new Trainer(network);

class Learning {
  constructor(trainingSet) {
    this.trainingSet = trainingSet;
    this.trainingObject = {
      rate: constants.LEARNING_RATE,
      iterations: trainingSet.length,
      error: 0.1,
      shuffle: false,
      log: 1,
      cost: Trainer.cost.CROSS_ENTROPY
    }
    trainer.train(this.trainingSet, this.trainingObject);
  }
  
  createOutputSpeedArray(speed) {
    const array = [...new Array(100)].map(item => 0);
    
    array[Math.round(speed)] = 1;
    
    return array;
  }
  
  [_testData](inputData) {
    return input.activate(inputData);
  }
  
  testData(inputData) {
    const result = this[_testData](inputData).map(item => item * 100);
    
    return result.reduce((a, b) => {return (a > b ? a : b);}, -1);
  }
}

module.exports = Learning;