/* eslint-env jest */

// This test will require a local default redis server
const { connect, check } = require('./helper/redis')
const init = require('./init')

describe('Init semaforo', () => {
  let redis
  let throttle

  function limits (k) {
    if (k === 'undefined') {
      return undefined
    } else if (k === 'null') {
      return null
    } else if (k === 'false') {
      return false
    } else if (k === 'true') {
      return true
    } else if (k === 'number1') {
      return 1
    } else if (k === 'number0') {
      return 0
    } else if (k === 'number-1') {
      return -1
    } else {
    }
  }

  beforeAll(async () => {
    redis = await connect()
    await check(redis)
    throttle = await init(redis, limits)
  })

  test('should add check method to redis', () => {
    expect(typeof redis.check).toBe('function')
  })

  test('should add check method to throttle', () => {
    expect(typeof throttle.check).toBe('function')
  })

  test('should pass the check with 1, undefined, null...', async () => {
    expect(await throttle.check('number1')).toBe(true)
    expect(await throttle.check('undefined')).toBe(true)
    expect(await throttle.check('null')).toBe(true)
    expect(await throttle.check('false')).toBe(true)
    expect(await throttle.check('true')).toBe(true)
    expect(await throttle.check('some-other-key')).toBe(true)
  })

  test('should be prevented by check with 0, -1', async () => {
    expect(await throttle.check('number0')).toBe(false)
    expect(await throttle.check('number-1')).toBe(false)
  })

  afterAll(() => {
    redis.quit()
  })
})
