const path = require('path');
const file = require('./file.js');
const { defaultOpts } = require('../CONSTANTS.json').NodeForage;

class NodeForage {
  constructor(opts = {}, parentFilepath = module.parent.filename) {
    this.name = opts.name || defaultOpts.name;
    this.description = opts.description || defaultOpts.description;
    this.size = opts.size || defaultOpts.size;
    this.isReady = false;
    this.filePath = `${process.cwd()}/${this.name}.db.json`;
  }

  async init() {
    if (!this.isReady) {
      await file.ensure(this.filePath, {});
      this.isReady = false;
    }
    return true;
  }

  async setItem(key, item) {
    if (!this.isReady) await this.init();
    const data = await file.read(this.filePath);
    data[key] = item;
    return file.write(this.filePath, data);
  }

  async getItem(key) {
    if (!this.isReady) await this.init();
    const data = await file.read(this.filePath);
    return (data[key]);
  }

  async delete() {
    this.isReady = false;
    return file.delete(this.filePath);
  }
}
module.exports = NodeForage;
