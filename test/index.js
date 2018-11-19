const { expect } = require('chai');
const NodeForage = require('../src/NodeForage');

describe('NodeForage', () => {
  it('should be able to create an instance', () => {
    const instance = new NodeForage();
    console.log(instance.name);
    expect(instance).to.be.a('object');
    expect(instance.constructor.name).to.be.equal('NodeForage');
    expect(instance).to.have.property('setItem');
    expect(instance).to.have.property('getItem');
  });
});
