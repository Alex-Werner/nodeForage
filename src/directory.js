const fs = require('fs');
const util = require('util');
const path = require('path');



const directory = {
  async create(p) {
    return new Promise((resolve, reject) => {
      fs.mkdir(p, (err) => {
        // if there is no error or if folder already exists
        if (!err || (err.code === 'EEXIST')) {
          return resolve(true);
        } if (err.code === 'ENOENT') {
          // Create parent
          return directory.create(path.dirname(p));
        }
        return reject(err);
      });
    });
  },
  async ensure(p) {
    const exist = await directory.exists(p);
    if(!exist){
      directory.create(p);
      return directory.ensure(p);
    }
    return exist;
  },
  async exists(p) {
    return new Promise((resolve, reject) => {
      fs.stat(p, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          return resolve(false);
        } if (err) {
          return reject(err);
        }
        if (stats.isFile() || stats.isDirectory()) {
          return resolve(true);
        }
        return false;
      });
    });
  },
  async delete(p) {
    const files = await directory.list(p);
    return new Promise((resolve,reject)=>{
      // If there is file, we remove them first
      Promise.all(files.map(async (file) => {
        try {
          const filep = path.join(p, file);
          fs.lstat(filep, (err,stat)=>{
            if (stat.isDirectory()) {
              fs.rmdir(filep, (err) => {
                if (err) rej(err);
                resolve(true);
              });
            } else {
              fs.unlink(filep, (err) => {
                if (err) rej(err);
                resolve(true);
              });
            }
          })

        } catch (err) {
          console.error(err);
        }
      })).then(()=>{
        fs.rmdir(p, (err) => {
          if (err) rej(err);
          resolve(true);
        });
      }).catch( (err)=> {
        console.error(err);
        reject(err);
      })
    });
  },
  currentPath() {
    return path.dirname(module.parent.filename);
  },
  async list(p = '') {
    return new Promise((resolve, reject) => {
      fs.readdir(p, (err, list) => {
        if (err && err.code === 'ENOENT') {
          return reject(err);
        } if (err) {
          return reject(err);
        }
        return resolve(list);
      });
    });
  },

};
module.exports = directory;
