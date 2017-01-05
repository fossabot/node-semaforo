/**
 * @fileOverview
 * @name Throttle.js<node-semaforo>
 * @author Liu Chong
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const cbop = require('./widgets/cbop');

/**
 * Throttle constructor.
 *
 * @param {Config} conf - throttle configuration
 */
function Throttle(conf) {
    if (!conf) throw new Error('invalid configuration of throttle!');
    /* redis is an instance which has already connected. */
    const redis = conf.redis;
    /* function to get the limit number */
    const getLimit = conf.limits;
    /* prefix used in redis key. */
    const prefix = conf.comm.prefix;
    /* expire is using milliseconds. */
    const expire = conf.comm.expire;
    /* timeout of responsing from redis. */
    const timeout = conf.comm.timeout;
    /* check pttl in lua */
    /* lua script will check pttl and will return 0 if exceeded the limit */
    if (!redis.check) {
        redis.defineCommand('check', {
            numberOfKeys: 1,
            lua: fs.readFileSync(path.join(__dirname, '../src/check.lua')),
        });
    }

    /**
     * throttle checker, return true if is prevented, or else false.
     *
     * @param {strint} k - throttle checking key
     * @param {function} [callback] - optional callback, return Promise if not given
     * @returns {Promise|undefined} - return Promise or nothing if callback passed in
     */
    this.check = function check(k, callback) {
        return cbop((resolve, reject) => {
            /* check if redis is up */
            if (redis.status !== 'ready') {
                reject(new Error(`redis error: status ${redis.status}`));
                return;
            }
            const limit = getLimit(k);
            /* 0, false, null, undefined means unlimited */
            if (!limit) {
                resolve(limit); /* resolve(false) */
                return;
            }
            /* < 0 or true means all prevented */
            if (limit < 0 || limit === true) {
                resolve(limit); /* resolve(true) */
                return;
            }
            let _timer; // eslint-disable-line no-underscore-dangle
            let _isTimeouted = false; // eslint-disable-line no-underscore-dangle
            if (timeout || timeout === 0) {
                _timer = setTimeout(() => {
                    _isTimeouted = true;
                    reject(new Error(`redis error timeout ${timeout}ms key ${k}`));
                }, timeout);
            }
            // let currExpire = expire - Date.now() % expire;
            redis.check(prefix + k, limit, expire)
                .then((r) => {
                    if (_isTimeouted) return;
                    clearTimeout(_timer);
                    resolve(r < 0);
                }, (e) => {
                    if (_isTimeouted) return;
                    clearTimeout(_timer);
                    reject(e);
                });
        }, callback);
    };
}

module.exports = Throttle;
