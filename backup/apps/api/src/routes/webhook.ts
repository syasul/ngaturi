import { Hono } from 'hono'
import crypto from 'crypto'
import { db, eq, orders, packages, weddings, transactions, users } from '../db'
import { getTripayConfig } from '../lib/tripay'
import { sendPaymentReceipt } from '../lib/mailer'
import { sendTelegramAlert } from '../lib/telegram'

const webhookRouter = new Hono()

webhookRouter.post('/payment', async (c) => {
  try {
    const rawBody = await c.req.text()
    const signature = c.req.header('x-callback-signature')

    // Parse payload
    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch (parseErr) {
      return c.json({ status: 'error', message: 'Payload JSON tidak valid.' }, 400)
    }

    const { reference, merchant_ref, status, payment_method, amount } = payload

    if (!merchant_ref) {
      return c.json({ status: 'error', message: 'merchant_ref tidak ditemukan.' }, 400)
    }

    // Retrieve config
    const config = await getTripayConfig()

    if (config && config.privateKey) {
      // Validate signature strictly
      const calculatedSignature = crypto
        .createHmac('sha256', config.privateKey)
        .update(rawBody)
        .digest('hex')

      if (signature !== calculatedSignature) {
        console.warn(`[Webhook Signature Mismatch] Expected: ${calculatedSignature}, Got: ${signature}`)
        return c.json({ status: 'error', message: 'Signature tidak cocok.' }, 403)
      }
    } else {
      console.warn('[Webhook Warning] Tripay Private Key not configured. Bypassing signature check for mock/local testing.')
    }

    // Process only if status is PAID
    // Tripay callback status values: PAID, EXPIRED, FAILED
    if (status !== 'PAID') {
      console.log(`[Webhook Info] Order ${merchant_ref} status is ${status}. Skipping activation.`)
      
      // Update order/transaction status if expired or failed
      if (status === 'EXPIRED' || status === 'FAILED') {
        const existingOrder = await db.query.orders.findFirst({
          where: eq(orders.id, merchant_ref),
        })
        if (existingOrder && existingOrder.status === 'PENDING') {
          await db.update(orders).set({ status }).where(eq(orders.id, merchant_ref))
          await db.update(transactions).set({ status: 'failed' }).where(eq(transactions.orderId, merchant_ref))
        }
      }
      
      return c.json({ success: true })
    }

    // Find the corresponding order
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, merchant_ref),
    })

    if (!order) {
      return c.json({ status: 'error', message: 'Order tidak ditemukan di database.' }, 404)
    }

    // Idempotency check: if already PAID, return success instantly
    if (order.status === 'PAID') {
      return c.json({ success: true, message: 'Transaksi sudah diproses sebelumnya.' })
    }

    // Update order status
    const paidAt = new Date()
    await db
      .update(orders)
      .set({
        status: 'PAID',
        paidAt: paidAt,
        paymentMethod: payment_method || order.paymentMethod,
      })
      .where(eq(orders.id, merchant_ref))

    // Update transaction log
    await db
      .update(transactions)
      .set({
        status: 'success',
        payload: { ...payload, processedAt: paidAt.toISOString() },
      })
      .where(eq(transactions.orderId, merchant_ref))

    // Fetch related package and user
    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, order.packageId),
    })

    const user = await db.query.users.findFirst({
      where: eq(users.id, order.userId),
    })

    if (user && pkg) {
      // Find user's wedding
      const wedding = await db.query.weddings.findFirst({
        where: eq(weddings.userId, user.id),
      })

      if (wedding) {
        // Calculate new expiration date
        const days = pkg.durationDays
        const now = new Date()
        let currentExpiry = wedding.expiredAt ? new Date(wedding.expiredAt) : new Date()
        
        // If already expired, start extension from now
        if (currentExpiry < now) {
          currentExpiry = now
        }
        currentExpiry.setDate(currentExpiry.getDate() + days)

        await db
          .update(weddings)
          .set({
            expiredAt: currentExpiry,
            // Also if package is premium, we could set additional flag, but schema handles limits by querying active package.
          })
          .where(eq(weddings.id, wedding.id))
        
        console.log(`[Subscription Updated] Extended wedding slug /u/${wedding.slug} expiry to ${currentExpiry.toISOString()}`)
      }

      // 1. Dispatch Email Receipt
      try {
        await sendPaymentReceipt(
          user.email,
          user.name,
          order.id.substring(0, 8).toUpperCase(),
          amount || order.amount,
          pkg.name,
          payment_method || order.paymentMethod || 'Tripay'
        )
      } catch (mailErr) {
        console.error('[Mail Error] Failed to send invoice email:', mailErr)
        // We do not crash the webhook, but log the error (as requested for retry/resilience)
      }

      // 2. Dispatch Telegram Bot Alert to Admin Channel
      try {
        const textAlert = `🔔 <b>PEMBAYARAN MASUK (NGATURI)</b>\n\n` +
          `• <b>Invoice:</b> INV-${order.id.substring(0, 8).toUpperCase()}\n` +
          `• <b>Customer:</b> ${user.name} (${user.email})\n` +
          `• <b>Paket:</b> ${pkg.name}\n` +
          `• <b>Jumlah:</b> Rp ${new Intl.NumberFormat('id-ID').format(amount || order.amount)}\n` +
          `• <b>Metode:</b> ${payment_method || 'Tripay'}\n` +
          `• <b>Status:</b> PAID ✅`
        await sendTelegramAlert(textAlert)
      } catch (telErr) {
        console.error('[Telegram Error] Failed to send alert:', telErr)
      }
    }

    return c.json({ success: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return c.json({ status: 'error', message: 'Gagal memproses webhook.' }, 500)
  }
})

export default webhookRouter
