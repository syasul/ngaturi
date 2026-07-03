import { describe, test, expect } from 'bun:test'
import { signAccessToken, verifyToken } from '../lib/jwt'

describe('JWT Utility Functions', () => {
  test('should successfully sign and verify a token payload', async () => {
    const payload = { userId: 'test-user-uuid-12345', role: 'USER' }
    
    // Sign token
    const token = await signAccessToken(payload)
    expect(token).toBeTypeOf('string')
    expect(token.length).toBeGreaterThan(10)

    // Verify token
    const verifiedPayload = await verifyToken(token)
    expect(verifiedPayload).not.toBeNull()
    expect(verifiedPayload?.userId).toBe(payload.userId)
    expect(verifiedPayload?.role).toBe(payload.role)
  })

  test('should return null for invalid or expired tokens', async () => {
    const invalidToken = 'invalid.token.signature'
    const result = await verifyToken(invalidToken)
    expect(result).toBeNull()
  })
})
