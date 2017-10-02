/**
 * @fileOverview
 * @name redis.js<node-semaforo>
 * @author Liu Chong
 * @license MIT
 */

'use strict'

const Redis = require('ioredis')
const noop = require('enen')

/* redis instance */
let redis = null
/* flag to test if redis instance has already been inited */
let _started = null // eslint-disable-line no-underscore-dangle

/** Simple redis connect function
 *
 * @param {object} redisConf - configuration to connect to redis server
 */
function connect (redisConf, logger = noop) {
  return new Promise((resolve, reject) => {
    /* create redis connect, resolve if already initialized */
    if (redis) {
      resolve(redis)
      return
    }

    /* init new ioredis instance */
    redis = new Redis(redisConf)
    redis.on('error', e => {
      logger.error(e.message)
    })
    /* invoke callback when redis is ready */
    redis.on('ready', () => {
      /* callback will only be invoked once */
      if (!_started) {
        _started = 1
        resolve(redis)
        logger.info('redis connected')
      }
    })

    /* panic if failed connect to redis after long on start up */
    setTimeout(() => {
      if (!_started) {
        _started = -1
        reject(new Error('failed connect to redis server!'))
      }
    }, 5000)
  })
}

/**
 * Disconnect the redis instance.
 */
function disconnect () {
  if (redis && typeof redis.disconnect === 'function') {
    redis.disconnect()
    redis = null
  }
}

/**
 * Redis instance checker
 *
 * @param {object} redis - passed in redis instance to be checked
 */
function check (redis) {
  return Promise.resolve().then(() => {
    if (redis.status !== 'ready') {
      throw new Error(`bad redis instance, status is ${redis.status}`)
    }
    if (typeof redis.defineCommand !== 'function') {
      throw new Error('bad redis instance, cannot .defineCommand()')
    }
    return redis
  })
}

module.exports = { connect, disconnect, check }
