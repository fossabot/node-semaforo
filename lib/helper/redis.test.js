/* eslint-env jest */

// This test will require a local default redis server

const { connect, disconnect, check } = require('./redis')

describe('Redis connection helper', () => {
  test('should reject on a not-redis object', () => {
    expect(check({})).rejects.toBeDefined()
    expect(check({ status: 'ready' })).rejects.toBeDefined()
  })

  test('should resolve on a redis-like object', () => {
    const redis = { status: 'ready', defineCommand () {} }
    expect(check(redis)).resolves.toBe(redis)
  })

  describe('Bad redis configuration', () => {
    let redis

    test('should reject on a bad redis configuration', () => {
      redis = connect({ host: 'bad', port: '0' })
      expect(redis).rejects.toBeDefined()
    })

    afterAll(() => {
      disconnect()
    })
  })

  describe('After redis instance initialized', () => {
    let redis

    beforeAll(async () => {
      redis = await connect()
    })

    test('should connected redis status should be ready', () => {
      expect(redis.status).toBe('ready')
    })

    test('should get the same redis instance via check', async () => {
      expect(await check(redis)).toBe(redis)
    })

    afterAll(() => {
      disconnect()
    })
  })
})
