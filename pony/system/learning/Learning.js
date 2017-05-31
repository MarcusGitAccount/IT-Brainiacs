'use strict';

const synaptic = require('synaptic');
const constants = require('./constants');

const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Trainer = synaptic.Trainer;

const input = new Layer(constants.INPUT_LAYERS);
const hidden = new Layer(constants.HIDDEN_LAYERS);
const output = new Layer(constants.OUTPUT_LAYERS);

const _testData = Symbol('_testData');

input.project(hidden);
hidden.project(output);

const network = new Network({
  input: input,
  hidden: [hidden],
  output: output
});

const trainer = new Trainer(network);

class Learning {
  train(trainingSet, iterations) {
    this.trainingSet = trainingSet;
    this.trainingObject = {
      rate: constants.LEARNING_RATE,
      iterations: 28,
      error: 0.1,
      shuffle: true,
      log: 1,
      cost: Trainer.cost.CROSS_ENTROPY
    };
    trainer.train(this.trainingSet, this.trainingObject);
  }
  
  createOutputSpeedArray(speed) {
    const array = [...new Array(100)].map(item => 0);
    
    array[Math.round(speed)] = 1;
    
    return array;
  }
  
  [_testData](inputData) {
    input.activate(inputData);
    
    return output.activate();
  }
  
  testData(inputData) {
    const result = this[_testData](inputData).map(item => Math.round(item * 100));
    
    return result;//.reduce((a, b) => {return (a > b ? a : b);}, -1);
  }
}

module.exports = Learning;