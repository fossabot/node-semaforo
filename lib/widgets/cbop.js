/**
 * @fileOverview
 * @name cbop.js
 * @author Liu Chong
 * @license MIT
 */

/**
 * Invoke the callback or return a Promise.
 * "cbop" will takes two arguments, first is a function of Promise executor
 * format like function(resolve, reject) { ... }, the second is which MAYBE
 * a callback function or null.
 * If second argument is a function, will invoke it as callback and return null,
 * or will return a Promise.
 *
 * Examples:
 *     function myFuncion(arg, callback) {
 *          const fs = require('fs);
 *          return cbop((resolve, reject)=>{
 *              fs.readFile('/etc/passwd',(err, result)=>{
 *              if(err) {
 *                  reject(err);
 *                  return;
 *              }
 *              resolve(result);
 *          });
 *          }, callback);
 *     }
 *
 * @param {function} f - the function as the Promise executor
 * @param {function|null} ab - a unknown argument MAYBE a function or null
 */
function cbop(f, cb) {
    const p = new Promise(f);

    if (typeof cb !== 'function') return p;

    p.then(cb.bind(null, null),
        cb);
    return null;
}

module.exports = cbop;
