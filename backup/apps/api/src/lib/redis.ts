import Redis from 'ioredis'
import env from './config'

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
})

redis.on('connect', () => {
  console.log('✅ Redis client connected successfully')
})

redis.on('error', (err) => {
  console.error('❌ Redis client error:', err)
})

export default redis
