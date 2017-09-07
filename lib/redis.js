/**
 * @fileOverview
 * @name redis.js<node-semaforo>
 * @author Liu Chong
 * @license MIT
 */

'use strict'

const Redis = require('ioredis')
const noop = require('./noop')

/* redis instance */
let redis = null
/* flag to test if redis instance has already been inited */
let _started = null // eslint-disable-line no-underscore-dangle

module.exports = function conn (redisOrConf, logger) {
  const myLogger = logger || noop

  return new Promise((resolve, reject) => {
    /* create redis connect, resolve if already initialized */
    if (redis) {
      resolve(redis)
      return
    }

    /* resolve without check if passed in a ioredis instance */
    if (redisOrConf instanceof Redis) {
      redis = redisOrConf
      resolve(redis)
      return
    }

    /* init new ioredis instance */
    redis = new Redis(redisOrConf)
    redis.on('error', e => {
      myLogger.error(e.message)
    })
    /* invoke callback when redis is ready */
    redis.on('ready', () => {
      /* callback will only be invoked once */
      if (!_started) {
        _started = 1
        resolve(redis)
        myLogger.info('redis connected')
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
