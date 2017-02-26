/**
 * @fileOverview
 * @name noop.js
 * @author Liu Chong
 * @license MIT
 */

'use strict';

/**
 * Advanced noop.
 *
 * Examples:
 *     const f0 = f();
 *     const f1 = f(1);
 *     const f2 = f.g(2);
 *     const f3 = f.g.h(3);
 *     console.log(f0, f1, f2, f3);
 *     the output is expected to be:
 *     undefined undefined undefined undefined
 */
const noop = new Proxy(() => {}, {
    get: () => noop,
});

module.exports = noop;
