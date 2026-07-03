import type { MiddlewareHandler } from 'hono'
import { verifyToken } from '../lib/jwt'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED'
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        status: 'error',
        message: 'Unauthorized: Missing or invalid token format',
      },
      401,
    )
  }

  const token = authHeader.substring(7)
  const decoded = await verifyToken(token)

  if (!decoded) {
    return c.json(
      {
        status: 'error',
        message: 'Unauthorized: Invalid or expired token',
      },
      401,
    )
  }

  // Inject user info into Context
  c.set('user', decoded as AuthUser)

  await next()
}

export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get('user')

  if (!user || user.role !== 'ADMIN') {
    return c.json(
      {
        status: 'error',
        message: 'Forbidden: Admin role required',
      },
      403,
    )
  }

  await next()
}
export default { requireAuth, requireAdmin }
