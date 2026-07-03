import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { db, eq } from '../db'
import { users } from '../db/schema'
import redis from '../lib/redis'
import env from '../lib/config'
import { signAccessToken } from '../lib/jwt'
import { sendVerificationOTP, sendPasswordReset } from '../lib/mailer'
import { requireAuth } from '../middleware/auth'
import bcrypt from 'bcryptjs'
import {
  RegisterInputSchema,
  VerifyEmailInputSchema,
  LoginInputSchema,
  ForgotPasswordInputSchema,
  ResetPasswordInputSchema,
} from '@wedding/shared'

const authRouter = new Hono()

// 1. POST /auth/register - Daftar user baru
authRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const result = RegisterInputSchema.safeParse(body)

    if (!result.success) {
      return c.json(
        {
          status: 'error',
          message: 'Validasi input gagal',
          errors: result.error.flatten().fieldErrors,
        },
        400,
      )
    }

    const { name, email, password } = result.data

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (existingUser) {
      if (existingUser.status === 'ACTIVE') {
        return c.json(
          {
            status: 'error',
            message: 'Email sudah terdaftar. Silakan masuk.',
          },
          400,
        )
      }
      // If user status is PENDING, we allow updating credentials/resending OTP
      const passwordHash = await bcrypt.hash(password, 12)
      await db
        .update(users)
        .set({ name, passwordHash, createdAt: new Date() })
        .where(eq(users.id, existingUser.id))
    } else {
      // Create new pending user
      const passwordHash = await bcrypt.hash(password, 12)
      await db.insert(users).values({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
        status: 'PENDING',
      })
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in Redis (expires in 10 minutes - 600s)
    await redis.set(`otp:email:${email.toLowerCase()}`, otp, 'EX', 600)

    // Send OTP email
    await sendVerificationOTP(email.toLowerCase(), name, otp)

    return c.json({
      status: 'success',
      message: 'OTP verifikasi telah dikirim ke email Anda.',
      email: email.toLowerCase(),
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ status: 'error', message: 'Registrasi gagal. Silakan coba lagi.' }, 500)
  }
})

// 2. POST /auth/verify-email - Verifikasi OTP
authRouter.post('/verify-email', async (c) => {
  try {
    const body = await c.req.json()
    const result = VerifyEmailInputSchema.safeParse(body)

    if (!result.success) {
      return c.json(
        {
          status: 'error',
          message: 'Validasi input gagal',
          errors: result.error.flatten().fieldErrors,
        },
        400,
      )
    }

    const { email, otp } = result.data
    const cachedOtp = await redis.get(`otp:email:${email.toLowerCase()}`)

    if (!cachedOtp || cachedOtp !== otp) {
      return c.json(
        {
          status: 'error',
          message: 'Kode OTP tidak valid atau telah kedaluwarsa.',
        },
        400,
      )
    }

    // Look up pending user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (!user) {
      return c.json({ status: 'error', message: 'User tidak ditemukan.' }, 400)
    }

    // Set user as active
    await db
      .update(users)
      .set({ status: 'ACTIVE' })
      .where(eq(users.id, user.id))

    // Clear OTP from Redis
    await redis.del(`otp:email:${email.toLowerCase()}`)

    return c.json({
      status: 'success',
      message: 'Email berhasil diverifikasi. Silakan masuk.',
    })
  } catch (error) {
    console.error('Verification error:', error)
    return c.json({ status: 'error', message: 'Verifikasi gagal. Silakan coba lagi.' }, 500)
  }
})

// 2.1 POST /auth/resend-otp - Kirim ulang OTP verifikasi
authRouter.post('/resend-otp', async (c) => {
  try {
    const { email } = await c.req.json()
    if (!email) {
      return c.json({ status: 'error', message: 'Email wajib diisi' }, 400)
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (!user) {
      return c.json({ status: 'error', message: 'User tidak ditemukan.' }, 400)
    }

    if (user.status !== 'PENDING') {
      return c.json({ status: 'error', message: 'Email sudah terverifikasi. Silakan masuk.' }, 400)
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in Redis (expires in 10 minutes - 600s)
    await redis.set(`otp:email:${email.toLowerCase()}`, otp, 'EX', 600)

    // Send OTP email
    await sendVerificationOTP(email.toLowerCase(), user.name, otp)

    return c.json({
      status: 'success',
      message: 'Kode OTP baru telah dikirim ke email Anda.',
    })
  } catch (error) {
    console.error('Resend OTP error:', error)
    return c.json({ status: 'error', message: 'Gagal mengirim ulang OTP.' }, 500)
  }
})

// 3. POST /auth/login - Login user, set httpOnly refresh token, return access token
authRouter.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const result = LoginInputSchema.safeParse(body)

    if (!result.success) {
      return c.json(
        {
          status: 'error',
          message: 'Validasi input gagal',
          errors: result.error.flatten().fieldErrors,
        },
        400,
      )
    }

    const { email, password } = result.data
    const ip =
      c.req.header('x-forwarded-for') ||
      c.req.header('x-real-ip') ||
      'anonymous'

    // Rate Limit Check (max 5 failed attempts per 15 minutes per IP)
    const loginFailuresKey = `login_failures:${ip}`
    const failures = await redis.get(loginFailuresKey)

    if (failures && parseInt(failures) >= 5) {
      return c.json(
        {
          status: 'error',
          message:
            'Terlalu banyak percobaan masuk yang gagal. Akun Anda ditangguhkan selama 15 menit.',
        },
        429,
      )
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      // Increment failed login attempt
      const newFailures = await redis.incr(loginFailuresKey)
      if (newFailures === 1) {
        await redis.expire(loginFailuresKey, 900) // 15 minutes in seconds
      }

      return c.json(
        {
          status: 'error',
          message: 'Email atau kata sandi salah.',
        },
        400,
      )
    }

    // Check account status
    if (user.status === 'PENDING') {
      // Auto-send verification code if user attempts login but is unverified
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      await redis.set(`otp:email:${user.email}`, otp, 'EX', 600)
      await sendVerificationOTP(user.email, user.name, otp)

      return c.json(
        {
          status: 'unverified',
          message: 'Email Anda belum diverifikasi. OTP baru telah dikirim.',
          email: user.email,
        },
        400,
      )
    }

    if (user.status === 'BLOCKED') {
      return c.json(
        {
          status: 'error',
          message: 'Akun Anda diblokir. Silakan hubungi dukungan.',
        },
        400,
      )
    }

    // Clear failed logins on successful login
    await redis.del(loginFailuresKey)

    // Sign Access Token (valid for 15 minutes)
    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    }
    const accessToken = await signAccessToken(userPayload)

    // Generate Refresh Token (UUID) and store in Redis (valid for 7 days)
    const refreshToken = crypto.randomUUID()
    const refreshTTL = 7 * 24 * 60 * 60 // 7 days in seconds
    await redis.set(
      `refreshtoken:${refreshToken}`,
      JSON.stringify({ userId: user.id }),
      'EX',
      refreshTTL,
    )

    // Set Refresh Token in httpOnly Cookie
    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: refreshTTL,
    })

    return c.json({
      status: 'success',
      user: userPayload,
      accessToken,
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ status: 'error', message: 'Gagal masuk. Silakan coba lagi.' }, 500)
  }
})

// 4. POST /auth/refresh - Refresh Access Token & Rotate Refresh Token
authRouter.post('/refresh', async (c) => {
  try {
    const refreshToken = getCookie(c, 'refreshToken')

    if (!refreshToken) {
      return c.json({ status: 'error', message: 'Token refresh tidak ditemukan.' }, 401)
    }

    const redisData = await redis.get(`refreshtoken:${refreshToken}`)
    if (!redisData) {
      return c.json({ status: 'error', message: 'Sesi masuk telah kedaluwarsa.' }, 401)
    }

    const { userId } = JSON.parse(redisData)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user || user.status !== 'ACTIVE') {
      return c.json({ status: 'error', message: 'User tidak ditemukan atau diblokir.' }, 401)
    }

    // Rotate refresh token: delete old, create new
    const newRefreshToken = crypto.randomUUID()
    const refreshTTL = 7 * 24 * 60 * 60
    await redis.del(`refreshtoken:${refreshToken}`)
    await redis.set(
      `refreshtoken:${newRefreshToken}`,
      JSON.stringify({ userId: user.id }),
      'EX',
      refreshTTL,
    )

    // Set new Cookie
    setCookie(c, 'refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: refreshTTL,
    })

    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    }
    const accessToken = await signAccessToken(userPayload)

    return c.json({
      status: 'success',
      user: userPayload,
      accessToken,
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return c.json({ status: 'error', message: 'Refresh token gagal.' }, 500)
  }
})

// 5. POST /auth/logout - Logout user
authRouter.post('/logout', async (c) => {
  try {
    const refreshToken = getCookie(c, 'refreshToken')

    if (refreshToken) {
      await redis.del(`refreshtoken:${refreshToken}`)
    }

    deleteCookie(c, 'refreshToken', {
      path: '/',
      secure: env.NODE_ENV === 'production',
      sameSite: 'Lax',
    })

    return c.json({ status: 'success', message: 'Keluar berhasil.' })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({ status: 'error', message: 'Gagal keluar.' }, 500)
  }
})

// 6. POST /auth/forgot-password - Minta link reset password
authRouter.post('/forgot-password', async (c) => {
  try {
    const body = await c.req.json()
    const result = ForgotPasswordInputSchema.safeParse(body)

    if (!result.success) {
      return c.json(
        {
          status: 'error',
          message: 'Validasi input gagal',
          errors: result.error.flatten().fieldErrors,
        },
        400,
      )
    }

    const { email } = result.data
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    // Secure response: always return success to prevent user enum
    if (user && user.status === 'ACTIVE') {
      const resetToken = crypto.randomUUID()
      const tokenTTL = 3600 // 1 hour

      // Store reset token -> email map in Redis
      await redis.set(`resettoken:${resetToken}`, user.email, 'EX', tokenTTL)

      // Send email
      const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`
      await sendPasswordReset(user.email, user.name, resetLink)
    }

    return c.json({
      status: 'success',
      message: 'Tautan atur ulang kata sandi telah dikirim ke email Anda jika terdaftar.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return c.json({ status: 'error', message: 'Permintaan reset gagal.' }, 500)
  }
})

// 7. POST /auth/reset-password - Reset password dengan token
authRouter.post('/reset-password', async (c) => {
  try {
    const body = await c.req.json()
    const result = ResetPasswordInputSchema.safeParse(body)

    if (!result.success) {
      return c.json(
        {
          status: 'error',
          message: 'Validasi input gagal',
          errors: result.error.flatten().fieldErrors,
        },
        400,
      )
    }

    const { token, password } = result.data
    const email = await redis.get(`resettoken:${token}`)

    if (!email) {
      return c.json(
        {
          status: 'error',
          message: 'Token atur ulang kata sandi tidak valid atau telah kedaluwarsa.',
        },
        400,
      )
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return c.json({ status: 'error', message: 'User tidak ditemukan.' }, 400)
    }

    // Hash & update password
    const passwordHash = await bcrypt.hash(password, 12)
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, user.id))

    // Revoke reset token (one-time use)
    await redis.del(`resettoken:${token}`)

    // Revoke all refresh tokens for this user to force re-login on all devices (security best practice)
    const keys = await redis.keys('refreshtoken:*')
    for (const key of keys) {
      const redisData = await redis.get(key)
      if (redisData) {
        const { userId } = JSON.parse(redisData)
        if (userId === user.id) {
          await redis.del(key)
        }
      }
    }

    return c.json({
      status: 'success',
      message: 'Kata sandi berhasil diperbarui. Silakan masuk kembali.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return c.json({ status: 'error', message: 'Reset password gagal.' }, 500)
  }
})

// 8. GET /auth/me - Dapatkan info profile user login
authRouter.get('/me', requireAuth, async (c) => {
  const user = c.get('user')
  return c.json({
    status: 'success',
    user,
  })
})

export default authRouter
