const fs = require('fs');
const path = require('path');
const url = require('url');
const http = require('http');
const https = require('https');
const { ensure } = require('./directory.js');
const { CannotReadFileNotFound } = require('./errors.js');

function stringify(obj, options) {
  let spaces;
  let EOL = '\n';
  if (typeof options === 'object' && options !== null) {
    if (options.spaces) {
      spaces = options;
    }
    if (options.EOL) {
      EOL = options;
    }
  }
  const str = JSON.stringify(obj, options ? options.replacer : null, spaces);
  return str.replace(/\n/g, EOL) + EOL;
}

const file = {
  async size(p) {
    return new Promise((res, rej) => {
      fs.stat(p, (err, stats) => {
        if (err) rej(err);
        res(stats);
      });
    });
  },
  currentPath() {
    return module.parent.filename;
  },
  async create(p, data = '') {
    return new Promise(async (res, rej) => {
      await ensure(path.dirname(p));
      fs.writeFile(p, stringify(data), (err) => {
        if (err) rej(err);
        res(true);
      });
    });
  },
  async exists(p) {
    return new Promise((resolve, reject) => fs.stat(p, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        return resolve(false);
      } if (err && err.code === 'ENOTDIR') {
        return resolve(false);
      }
      if (err) {
        return reject(err);
      }

      if (stats.isFile() || stats.isDirectory()) {
        return resolve(true);
      }
      return false;
    }));
  },
  async ensure(p, data) {
    const exist = await file.exists(p);
    return (!exist) ? file.create(p, data) : exist;
  },
  async read(p, options = null) {
    const isFILE = await file.exists(p);
    if (!isFILE) throw new CannotReadFileNotFound({ path: p });
    return new Promise((res, rej) => {
      let output;
      fs.readFile(p, options, (err, data) => {
        if (err) rej(err);
        if (Buffer.isBuffer(data)) output = data.toString('utf8');
        output = output.replace(/^\uFEFF/, '');
        let obj;
        try {
          obj = JSON.parse(output, options ? options.reviver : null);
        } catch (err2) {
          rej(err2);
        }
        res(obj);
      });
    });
  },
  async append(p, data) {
    return new Promise((res, rej) => {
      fs.appendFile(p, data, (err) => {
        if (err) rej(err);
        res(true);
      });
    });
  },
  async delete(p) {
    return new Promise((res, rej) => {
      fs.unlink(p, (err) => {
        if (err) rej(err);
        res(true);
      });
    });
  },
  async download(uri, outputPath) {
    let store = true;
    return new Promise(async (resolve, reject) => {
      if (!uri) reject(new Error('Require uri'));
      if (!outputPath) store = false;
      if (store) await file.ensure(outputPath);
      const timeout = 20 * 1000;// 20 seconde timeout (time to get the response)
      const { protocol } = url.parse(uri);
      const req = (protocol === 'https:') ? https : http;

      const URL = (protocol === null) ? `http://${uri}` : uri;

      const request = req.get(URL, (response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          if (store) {
            const outputFile = fs.createWriteStream(outputPath);
            response.pipe(outputFile);
            outputFile.on('finish', () => {
            });
            outputFile.on('close', () => resolve(outputPath));
          } else {
            let buff;
            response.on('data', (chunk) => {
              buff = (buff === undefined) ? Buffer.from(chunk) : Buffer.concat([buff, chunk]);
            });
            response.on('end', () => resolve(buff));
          }
        } else if (statusCode === 303 || statusCode === 302 || statusCode === 301) {
          // Redirection
          const newURL = response.headers.location;
          console.log('Redirect to', newURL);
          // throw("Moved to ",newURL)
          return resolve(file.download(newURL, outputPath));
        } else if (statusCode === 404) {
          // throw("Unreachable domain", statusCode);
          return resolve(statusCode);
        } else {
          // throw("Got an statusCode", statusCode);
          return resolve(statusCode);
        }
        return false;
      }).on('error', e => resolve(e)).setTimeout(timeout, () => {
        request.abort();
        // Gateway time-out
        return resolve(504);
      }).end();
    });
  },
};
file.write = file.create;
module.exports = file;
