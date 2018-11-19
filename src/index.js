const merge = require('lodash.merge');
const NodeForage = require('./NodeForage.js');
const { defaultOpts } = require('../CONSTANTS.json').NodeForage;
const parentFilepath = module.parent.filename;

module.exports = {
  createInstance: opts => new NodeForage(merge(defaultOpts, opts),parentFilepath),
  NodeForage,
};
