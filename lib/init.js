/**
 * @fileOverview
 * @name index.js<node-semaforo>
 * @author Liu Chong
 * @license MIT
 */

'use strict'

const Config = require('./Config')
const Throttle = require('./Throttle')

const { check } = require('./helper/redis')

let _throttle // eslint-disable-line no-underscore-dangle

/**
 * Init the module scope throttle instance.
 *
 * @param {object} comm - common throttle configuration
 * @param {Redis} redisLike - ioredis (or similar) instance
 * @param {Map|function} limits - limits map or function
 * @param {object} [logger] - SUGGESTED optional logger, or else will log nothing
 * @returns {Promise} - returning a Promise
 */
module.exports = function init (redisLike, limits, comm) {
  return check(redisLike).then(redis => {
    const config = new Config(redis, limits, comm)
    _throttle = new Throttle(config)
    return _throttle
  })
}

/**
 * Get the module scope throttle instance.
 *
 * @returns {Throttle} - the throttle instance
 * @throws {Error} - throws if throttle has not been initialized
 */
module.exports.get = function get () {
  if (_throttle) return _throttle
  throw new Error('throttle has not been initialized')
}
