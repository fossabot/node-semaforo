const Redis = require('ioredis')
const redis = new Redis()

console.log(redis.status)
// redis.disconnect()
redis.quit()
