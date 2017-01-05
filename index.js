/**
 * @fileOverview
 * @name index.js<node-semaforo>
 * @author Liu Chong
 * @license MIT
 */

const redisInitor = require('./redis');
const Throttle = require('./Throttle');
const Config = require('./Config');
const cbop = require('./widgets/cbop');

let _throttle; // eslint-disable-line no-underscore-dangle

/**
 * Init the module scope throttle instance.
 *
 * @param {object} comm - common throttle configuration
 * @param {Redis|object} redisOrConf - ioredis instance or configuration
 * @param {Map|function} limits - limits map or function
 * @param {object} [logger] - SUGGESTED optional logger, or else will log nothing
 * @param {function} [callback] - optional callback, or else will return a Promise
 * @returns {Promise|undefined} - return Promise or nothing if callback passed in
 */
function init(comm, redisOrConf, limits, logger, callback) {
    return cbop((resolve, reject) => {
        redisInitor(redisOrConf, logger)
            .then((redis) => {
                const config = new Config(comm, redis, limits);
                _throttle = new Throttle(config);
                resolve(_throttle);
            }, reject);
    }, callback);
}

/**
 * Get the module scope throttle instance.
 *
 * @returns {Throttle} - the throttle instance
 * @throws {Error} - throws if throttle has not been initialized
 */
function get() {
    if (_throttle) return _throttle;
    throw new Error('throttle has not been inited');
}

module.exports = Object.assign(Throttle, {
    Throttle,
    Config,
    init,
    get,
});
