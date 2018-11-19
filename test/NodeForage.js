const { expect } = require('chai');
const NodeForage = require('../src/NodeForage');

describe('NodeForage creation', () => {
  it('should have a valid structure', () => {
    const instance = new NodeForage();
    expect(instance.name).to.be.equal('nodeforage');
    expect(instance.description).to.be.equal('');
    expect(instance.size).to.be.equal(64000000);
    expect(instance.isReady).to.be.equal(false);
  });
});

let instance;
describe('NodeForage usage', () => {
  before(() => {
    instance = new NodeForage();
  });
  it('should set an item ', async () => {
    expect(await instance.setItem('foo', 'bar')).to.be.equal(true);
    expect(await instance.setItem('bar', { a: 1, b: [{ c: true }] })).to.be.equal(true);
  });
  it('should read an item ', async () => {
    expect(await instance.getItem('foo')).to.be.equal('bar');
    expect(await instance.getItem('bar')).to.be.deep.equal({ a: 1, b: [{ c: true }] });
  });
  after(() => {
    instance.delete();
  });
});
