/**
 * @fileOverview
 * @name Config.js<node-semaforo>
 * @author Liu Chong
 * @license MIT
 */

'use strict'

const Redis = require('ioredis')

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
 * Check if the redis is instance of ioredis.
 *
 * @param {Redis} - unchecked ioredis instance
 * @returns {Redis} - checked ioredis instance
 * @throws {Error} - bad redis instance
 */
function getRedis (redis) {
  if (redis instanceof Redis && redis.status === 'ready') {
    return redis
  }
  throw new Error('bad redis instance')
}

/**
 * Make a valid configuration.
 *
 * @param {object} comm - defines the prefix, expire time(ms), timeout(ms)
 * @param {object|Redis} redis - ioredis configuration or instance
 * @param {Map|function} limits - limits Map or function
 */
function Config (comm, redis, limits) {
  // prefix format is like "throttle:appName:",
  // and expire is in milliseconds.
  this.comm = comm || {
    prefix: 'throttle:defaultApp:',
    expire: 1000,
    timeout: 2000
  }
  this.redis = getRedis(redis)
  this.limits = getLimits(limits)
}

module.exports = Config
