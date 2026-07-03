import * as jose from 'jose'
import env from './config'

const secret = new TextEncoder().encode(env.JWT_SECRET)

export async function signAccessToken(payload: Record<string, any>) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload
  } catch (err) {
    return null
  }
}
export default { signAccessToken, verifyToken }
