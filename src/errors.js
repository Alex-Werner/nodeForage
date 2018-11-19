class CannotReadFileNotFound extends Error {
  constructor(params = {}) {
    const path = params.path || null;
    super(path);
    this.name = this.constructor.name;
    this.path = params.path;
  }
}
module.exports = {
  CannotReadFileNotFound,
};
