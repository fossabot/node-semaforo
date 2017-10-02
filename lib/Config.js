/**
 * @fileOverview
 * @name Config.js<node-semaforo>
 * @author Liu Chong
 * @license MIT
 */

'use strict'

/**
 * Convert Map to function if given a Map or directly return the function.
 *
 * @param {function|Map} limits - a function or a map which keeping limits
 * @returns {function} - a function used to get the limit number by key
 */
function getLimits (limits) {
  return typeof limits === 'function' ? limits : k => limits[k]
}

/**
 * Make a valid configuration.
 *
 * @param {object} comm - defines the prefix, expire time(ms), timeout(ms)
 * @param {object|Redis} redis - ioredis configuration or instance
 * @param {Map|function} limits - limits Map or function
 */
function Config (redis, limits, comm) {
  // prefix format is like "throttle:appName:",
  // and expire is in milliseconds.
  this.comm = comm || {
    prefix: 'throttle:defaultApp:',
    expire: 1000,
    timeout: 2000
  }
  this.redis = redis
  this.limits = getLimits(limits || function () {})
}

module.exports = Config
