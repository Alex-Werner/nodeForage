const { expect } = require('chai');
const directory = require('../src/directory');

describe('directory', () => {
  it('should have a valid structure', () => {
    expect(directory).to.have.property('create');
    expect(directory).to.have.property('ensure');
    expect(directory).to.have.property('exists');
    expect(directory).to.have.property('delete');
    expect(directory).to.have.property('currentPath');
    expect(directory).to.have.property('list');
  });
  it('should get current path', async () => {
    const currPath = await directory.currentPath();
    expect(currPath).to.be.equal('/Users/awerner/GitHub/Alex-Werner/nodeForage/src');
  });
  it('should list all file of a folder', async () => {
    const currPath = await directory.currentPath();
    const listSource = await directory.list(`${currPath}/../src`);
    const expectedListSource = [
      'NodeForage.js',
      'directory.js',
      'errors.js',
      'file.js',
      'index.js'];
    expect(listSource).to.be.deep.equal(expectedListSource);

    const listSourceEmpty = await directory.list(`${currPath}/../test/fixtures/dir-a`);
    expect(listSourceEmpty).to.be.deep.equal([]);

    const pathDirNotExist = `${currPath}/../test/fixtures/dir-not-exist`;
    return directory
      .list(pathDirNotExist)
      .then(() => {
        throw new Error('Expected an error');
      }).catch((err) => {
        expect(err).to.be.an('Error');
        expect(err.message).to.be.equal('ENOENT: no such file or directory, scandir \'/Users/awerner/GitHub/Alex-Werner/nodeForage/src/../test/fixtures/dir-not-exist\'');
        return err;
      });
  });
  it('should get if a directory exists', async () => {
    const currPath = await directory.currentPath();
    const exist = await directory.exists(`${currPath}/../test/fixtures/dir-a`);
    expect(exist).to.be.deep.equal(true);

    const notexist = await directory.exists(`${currPath}/../test/fixtures/dir-not-exist`);
    expect(notexist).to.be.deep.equal(false);

    const fileexist = await directory.exists(`${currPath}/../test/fixtures/file-a.js`);
    expect(fileexist).to.be.deep.equal(true);
  });
  it('should create a directory', async () => {
    const currPath = await directory.currentPath();
    const ensuredPath = `${currPath}/../.fs.tests-directory`;

    const verifNotExist = await directory.exists(ensuredPath);
    expect(verifNotExist).to.be.equal(false);

    const ensured = await directory.ensure(ensuredPath);
    expect(ensured).to.be.equal(true);

    const verifExist = await directory.exists(ensuredPath);
    expect(verifExist).to.be.equal(true);
  });
  it('should ensure a directory', async () => {
    const currPath = await directory.currentPath();
    const ensuredPath = `${currPath}/../.fs.tests-directory/to-del`;

    const verifNotExist = await directory.exists(ensuredPath);
    expect(verifNotExist).to.be.equal(false);

    const ensured = await directory.ensure(ensuredPath);
    expect(ensured).to.be.equal(true);

    const verifExist = await directory.exists(ensuredPath);
    expect(verifExist).to.be.equal(true);
  });
  it('should delete a directory', async () => {
    const currPath = await directory.currentPath();
    const path = `${currPath}/../.fs.tests-directory/to-del`;
    await directory.create(path);

    let exist = await directory.exists(path);
    expect(exist).to.be.equal(true);

    const deleteFile = await directory.delete(path);
    expect(deleteFile).to.be.equal(true);

    exist = await directory.exists(path);
    expect(exist).to.be.equal(false);
  });
  it('should handle edges cases', async () => {

  });
  it('should clean up the mess', async () => {

  });
  after('clean up mess', async () => {
    const currPath = await directory.currentPath();
    const ensuredPath = `${currPath}/../.fs.tests-directory`;

    await directory.delete(ensuredPath);
  });
});
