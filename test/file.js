const { expect } = require('chai');
const path = require('path');
const file = require('../src/file');
const directory = require('../src/directory');

describe('file', function suite() {
  this.timeout(15000);
  it('should have a valid structure', () => {
    expect(file).to.have.property('size');
    expect(file).to.have.property('currentPath');
  });
  it('should get current file', async () => {
    const currPath = await file.currentPath();
    expect(currPath).to.be.equal('/Users/awerner/GitHub/Alex-Werner/nodeForage/src/NodeForage.js');
  });
  it('should get if a file exists', async () => {
    const currPath = path.dirname(await file.currentPath());
    const exist = await file.exists(`${currPath}/../test/fixtures/dir-b/file-b.md`);
    expect(exist).to.be.deep.equal(true);

    const notexist = await file.exists(`${currPath}/../test/fixtures/dir-b/file-not-exist.txt`);
    expect(notexist).to.be.deep.equal(false);
  });
  it('should create a file', async () => {
    const currPath = path.dirname(await file.currentPath());
    const ensuredPath = `${currPath}/../.fs.tests-file.to.del.txt`;

    const verifNotExist = await file.exists(ensuredPath);
    expect(verifNotExist).to.be.equal(false);

    const created = await file.create(ensuredPath);
    expect(created).to.be.equal(true);

    const verifExist = await file.exists(ensuredPath);
    expect(verifExist).to.be.equal(true);
  });
  it('should ensure a file', async () => {
    const currPath = path.dirname(await file.currentPath());
    const ensuredPath = `${currPath}/../.fs.tests-file/file-1.txt`;

    const verifNotExist = await file.exists(ensuredPath);
    expect(verifNotExist).to.be.equal(false);

    const ensured = await file.ensure(ensuredPath);
    expect(ensured).to.be.equal(true);

    const verifExist = await file.exists(ensuredPath);
    expect(verifExist).to.be.equal(true);
  });
  it('should delete a file', async () => {
    const currPath = path.dirname(await file.currentPath());
    const deletePath = `${currPath}/../.fs.tests-file.to.del.txt`;

    const verifExist = await file.exists(deletePath);
    expect(verifExist).to.be.equal(true);

    const deleted = await file.delete(deletePath);
    expect(deleted).to.be.equal(true);

    const verifNotExist = await file.exists(deletePath);
    expect(verifNotExist).to.be.equal(false);
  });
  it('should read a file', async () => {
    const currPath = path.dirname(await file.currentPath());
    const readPath = `${currPath}/../test/fixtures/readTest.json`;
    const data = await file.read(readPath);
    expect(data).to.be.an('object');
    expect(data.tables).to.be.an('array');
    expect(data.tables[0].url).to.be.equal('http://www.w3.org/2013/csvw/tests/test001.csv');
  });
  it('should download a file', async () => {
    const currPath = path.dirname(await file.currentPath());
    const uri = 'http://w3c.github.io/csvw/tests/test001.json';
    const validPath = `${currPath}/../test/fixtures/readTest.json`;
    const validData = await file.read(validPath);
    const outputFile = `${currPath}/../.fs.tests-file/writeTest.json`;

    const data = await file.download(uri);
    expect((JSON.parse(data))).to.deep.equal(validData);

    const store = await file.download(uri, outputFile);
    expect(store).to.be.equal('/Users/awerner/GitHub/Alex-Werner/nodeForage/src/../.fs.tests-file/writeTest.json');
    const exist = await file.exists(outputFile);
    expect(exist).to.be.equal(true);
    const read = await file.read(outputFile);
    expect(((read))).to.deep.equal(validData);
  });
  it('should handle edges cases', async () => {

  });

  after('clean up mess', async () => {
    const currPath = path.dirname(await file.currentPath());
    const ensuredPath = `${currPath}/../.fs.tests-file/file-1.txt`;
    const outputFile = `${currPath}/../.fs.tests-file/writeTest.json`;

    await file.delete(ensuredPath);
    await file.delete(outputFile);

    await directory.delete(`${currPath}/../.fs.tests-file`);
  });
});
