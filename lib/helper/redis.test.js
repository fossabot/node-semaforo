/* eslint-env jest */

// This test will require a local default redis server

const { connect, check } = require('./redis')

describe('Redis connection helper', () => {
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
    redis.quit()
  })
})
