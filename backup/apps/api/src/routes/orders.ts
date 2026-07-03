import { Hono } from 'hono'
import { db, eq, desc, and, transactions, orders, packages, weddings, users } from '../db'
import { requireAuth } from '../middleware/auth'
import { createTripayTransaction } from '../lib/tripay'
import { sendOrderCreated, sendAdminOrderNotification } from '../lib/mailer'

const ordersRouter = new Hono()

ordersRouter.use('*', requireAuth)

ordersRouter.get('/packages', async (c) => {
  try {
    const list = await db.query.packages.findMany()
    return c.json({ status: 'success', packages: list })
  } catch (error: any) {
    console.error('Error fetching packages:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil paket.' }, 500)
  }
})

ordersRouter.get('/history', async (c) => {
  const user = c.get('user')
  try {
    const list = await db
      .select({
        id: orders.id,
        status: orders.status,
        amount: orders.amount,
        paymentMethod: orders.paymentMethod,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt,
        packageName: packages.name,
      })
      .from(orders)
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt))

    return c.json({ status: 'success', history: list })
  } catch (error: any) {
    console.error('Error fetching order history:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil riwayat transaksi.' }, 500)
  }
})

ordersRouter.get('/:id', async (c) => {
  const user = c.get('user')
  const orderId = c.req.param('id')
  try {
    const list = await db
      .select({
        id: orders.id,
        status: orders.status,
        amount: orders.amount,
        paymentMethod: orders.paymentMethod,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt,
        packageName: packages.name,
      })
      .from(orders)
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
      .limit(1)

    if (list.length === 0) {
      return c.json({ status: 'error', message: 'Order tidak ditemukan.' }, 404)
    }

    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.orderId, orderId),
      orderBy: desc(transactions.createdAt),
    })

    return c.json({ status: 'success', order: list[0], transaction })
  } catch (error: any) {
    console.error('Error fetching order detail:', error)
    return c.json({ status: 'error', message: 'Gagal memuat detail order.' }, 500)
  }
})

ordersRouter.post('/checkout', async (c) => {
  const user = c.get('user')
  try {
    const { packageId, paymentMethod } = await c.req.json()
    if (!packageId || !paymentMethod) {
      return c.json({ status: 'error', message: 'ID Paket dan Metode Pembayaran wajib diisi.' }, 400)
    }

    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, packageId),
    })

    if (!pkg) {
      return c.json({ status: 'error', message: 'Paket tidak ditemukan.' }, 400)
    }

    // Create a pending order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: user.id,
        packageId: pkg.id,
        status: 'PENDING',
        amount: pkg.price,
        paymentMethod: paymentMethod,
      })
      .returning()

    // Register closed transaction to Tripay (will automatically run in Mock Simulation mode if credentials are empty)
    let tripayTrx
    try {
      tripayTrx = await createTripayTransaction({
        method: paymentMethod,
        merchantRef: newOrder.id,
        amount: pkg.price,
        customerName: user.name,
        customerEmail: user.email,
        packageName: pkg.name,
      })
    } catch (apiErr: any) {
      // Clean up the created order if payment gateway initialization fails
      await db.delete(orders).where(eq(orders.id, newOrder.id))
      return c.json({ status: 'error', message: apiErr.message || 'Gagal mendaftarkan tagihan ke payment gateway.' }, 400)
    }

    // Create transaction log
    await db.insert(transactions).values({
      orderId: newOrder.id,
      gatewayRef: tripayTrx.reference,
      status: 'pending',
      payload: tripayTrx,
    })

    // Send payment instructions email to customer
    try {
      await sendOrderCreated(
        user.email,
        user.name,
        newOrder.id,
        newOrder.amount,
        pkg.name,
        tripayTrx.payment_name || paymentMethod,
        tripayTrx.payment_code,
        tripayTrx.qr_url
      )
    } catch (mailErr) {
      console.error('[Mail Error] Failed to send order confirmation email to customer:', mailErr)
    }

    // Send new order notifications to all admins
    try {
      const admins = await db.select().from(users).where(eq(users.role, 'ADMIN'))
      for (const admin of admins) {
        try {
          await sendAdminOrderNotification(
            admin.email,
            newOrder.id,
            newOrder.amount,
            pkg.name,
            user.name,
            user.email
          )
        } catch (adminMailErr) {
          console.error(`[Mail Error] Failed to notify admin ${admin.email}:`, adminMailErr)
        }
      }
    } catch (adminErr) {
      console.error('[Admin Query Error] Failed to fetch admins for order notification:', adminErr)
    }

    return c.json({
      status: 'success',
      message: 'Transaksi berhasil didaftarkan.',
      order: newOrder,
      tripay: tripayTrx,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return c.json({ status: 'error', message: 'Gagal memproses pembayaran.' }, 500)
  }
})

export default ordersRouter
