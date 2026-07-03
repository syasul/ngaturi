import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { promises as fs } from 'fs'
import { join } from 'path'
import env from './lib/config'
import rateLimiter from './middleware/rateLimiter'
import authRouter from './routes/auth'
import themesRouter from './routes/themes'
import ordersRouter from './routes/orders'
import weddingsRouter from './routes/weddings'
import guestsRouter from './routes/guests'
import mediaRouter from './routes/media'
import adminRouter from './routes/admin'
import webhookRouter from './routes/webhook'
import { db, eq, lt, and, orders, transactions, weddings, users, isNull, gt } from './db'
import { sendExpirationWarning } from './lib/mailer'

const app = new Hono()

// Global Middlewares
app.use('*', logger())
app.use('*', secureHeaders())
app.use(
  '*',
  cors({
    origin: (origin) => {
      if (env.NODE_ENV === 'development') return origin
      const allowedOrigin = env.FRONTEND_URL || 'http://localhost:5173'
      return origin === allowedOrigin ? origin : allowedOrigin
    },
    credentials: true,
  }),
)

// Apply route-specific and global rate limiting
app.use('/api/auth/*', rateLimiter(20, 60)) // Max 20 requests per minute for Auth endpoints
app.use('/api/webhook/*', rateLimiter(15, 60)) // Max 15 requests per minute for Webhooks
app.use('*', rateLimiter(120, 60)) // Max 120 requests per minute global fallback

// Dynamic Sitemap XML Endpoint
app.get('/sitemap.xml', async (c) => {
  try {
    const list = await db
      .select({
        slug: weddings.slug,
        createdAt: weddings.createdAt,
      })
      .from(weddings)
      .where(eq(weddings.status, 'published'))

    const baseUrl = process.env.FRONTEND_URL || 'https://ngaturi.id'
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/kebijakan-privasi</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/syarat-ketentuan</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/tentang-kami</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/kontak</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`

    for (const item of list) {
      xml += `
  <url>
    <loc>${baseUrl}/u/${item.slug}</loc>
    <lastmod>${new Date(item.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    }

    xml += '\n</urlset>'

    return c.body(xml, 200, {
      'Content-Type': 'application/xml; charset=UTF-8',
    })
  } catch (err) {
    console.error('Error generating sitemap.xml:', err)
    return c.text('Error generating sitemap', 500)
  }
})

// Custom Static File Server for Local Uploads
app.get('/uploads/:filename', async (c) => {
  const filename = c.req.param('filename')
  const filePath = join(process.cwd(), 'public', 'uploads', filename)
  try {
    const file = await fs.readFile(filePath)
    let contentType = 'image/jpeg'
    if (filename.endsWith('.png')) contentType = 'image/png'
    else if (filename.endsWith('.webp')) contentType = 'image/webp'
    else if (filename.endsWith('.mp3')) contentType = 'audio/mpeg'
    
    return c.body(file, 200, {
      'Content-Type': contentType,
    })
  } catch (e) {
    return c.text('Not found', 404)
  }
})

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'SaaS Undangan Online API',
    environment: env.NODE_ENV,
  })
})

// Mounting Routers
app.route('/auth', authRouter)
app.route('/themes', themesRouter)
app.route('/orders', ordersRouter)
app.route('/weddings', weddingsRouter)
app.route('/guests', guestsRouter)
app.route('/media', mediaRouter)
app.route('/admin', adminRouter)
app.route('/webhook', webhookRouter)

// Background worker to cancel expired pending orders (>24 hours)
async function cancelExpiredOrders() {
  try {
    const limitDate = new Date()
    limitDate.setHours(limitDate.getHours() - 24)

    const result = await db
      .update(orders)
      .set({ status: 'EXPIRED' })
      .where(and(eq(orders.status, 'PENDING'), lt(orders.createdAt, limitDate)))
      .returning({ id: orders.id })

    if (result.length > 0) {
      console.log(`[Cron] Cancelled ${result.length} pending orders that exceeded 24 hours.`)
      for (const ord of result) {
        await db
          .update(transactions)
          .set({ status: 'failed' })
          .where(eq(transactions.orderId, ord.id))
      }
    }
  } catch (err) {
    console.error('Error in cron job cancelExpiredOrders:', err)
  }
}

// Run immediately and then every 10 minutes
cancelExpiredOrders()
setInterval(cancelExpiredOrders, 10 * 60 * 1000)

async function checkExpirationWarnings() {
  try {
    const now = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const list = await db
      .select({
        weddingId: weddings.id,
        slug: weddings.slug,
        expiredAt: weddings.expiredAt,
        userName: users.name,
        userEmail: users.email,
        weddingData: weddings.data,
      })
      .from(weddings)
      .innerJoin(users, eq(weddings.userId, users.id))
      .where(
        and(
          eq(weddings.status, 'published'),
          isNull(weddings.expirationWarningSentAt),
          gt(weddings.expiredAt, now),
          lt(weddings.expiredAt, sevenDaysFromNow)
        )
      )

    for (const item of list) {
      if (!item.expiredAt) continue

      const title = item.weddingData?.title || `Undangan /u/${item.slug}`
      const dateStr = new Date(item.expiredAt).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      console.log(`[Cron Expiration] Sending 7-day warning for wedding /u/${item.slug} to ${item.userEmail}`)
      
      try {
        await sendExpirationWarning(
          item.userEmail,
          item.userName,
          title,
          dateStr
        )

        await db
          .update(weddings)
          .set({ expirationWarningSentAt: new Date() })
          .where(eq(weddings.id, item.weddingId))
      } catch (mailErr) {
        console.error(`[Cron Expiration Error] Failed to send email to ${item.userEmail}:`, mailErr)
      }
    }
  } catch (err) {
    console.error('Error in cron job checkExpirationWarnings:', err)
  }
}

// Run immediately and then every 12 hours
checkExpirationWarnings()
setInterval(checkExpirationWarnings, 12 * 60 * 60 * 1000)

// Global Error Handler
app.onError((err, c) => {
  console.error('Unhandled Server Error:', err)
  return c.json(
    {
      status: 'error',
      message: err.message || 'Internal Server Error',
    },
    500,
  )
})

export { app }
export default {
  port: env.PORT,
  fetch: app.fetch,
}
