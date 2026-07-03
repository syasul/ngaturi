import type { MiddlewareHandler } from 'hono'
import redis from '../lib/redis'

export function rateLimiter(limit = 60, windowSeconds = 60): MiddlewareHandler {
  return async (c, next) => {
    const ip =
      c.req.header('x-forwarded-for') ||
      c.req.header('x-real-ip') ||
      'anonymous'
    const key = `ratelimit:${c.req.path}:${ip}`

    try {
      const current = await redis.incr(key)
      if (current === 1) {
        await redis.expire(key, windowSeconds)
      }

      c.header('X-RateLimit-Limit', limit.toString())
      c.header('X-RateLimit-Remaining', Math.max(0, limit - current).toString())

      if (current > limit) {
        return c.json(
          {
            status: 'error',
            message: 'Too many requests. Please try again later.',
          },
          429,
        )
      }
    } catch (err) {
      console.error('Rate limiter error:', err)
      // Fail-safe open: continue processing request if Redis has errors
    }

    await next()
  }
}

export default rateLimiter
