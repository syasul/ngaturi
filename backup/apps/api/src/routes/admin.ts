import { Hono } from 'hono'
import { db } from '../db'
import {
  users,
  orders,
  packages,
  themes,
  weddings,
  transactions,
  music,
  systemSettings,
} from '../db/schema'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { eq, and, gte, lte, desc, like, count, sum, sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const adminRouter = new Hono()

// Protect all admin endpoints
adminRouter.use('*', requireAuth, requireAdmin)

// ==========================================
// 4.2 OVERVIEW & ANALYTICS
// ==========================================
adminRouter.get('/analytics', async (c) => {
  try {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // 1. KPI Cards
    // Total Revenue (current month)
    const revRes = await db
      .select({ val: sum(orders.amount) })
      .from(orders)
      .where(and(eq(orders.status, 'PAID'), gte(orders.paidAt, firstDayOfMonth)))
    const totalRevenueMonth = Number(revRes[0]?.val || 0)

    // Total Users
    const usersRes = await db
      .select({ val: count() })
      .from(users)
      .where(eq(users.role, 'USER'))
    const totalUsers = Number(usersRes[0]?.val || 0)

    // Active/Live Weddings
    const weddingsRes = await db
      .select({ val: count() })
      .from(weddings)
      .where(eq(weddings.status, 'published'))
    const liveWeddings = Number(weddingsRes[0]?.val || 0)

    // Order Pending
    const pendingRes = await db
      .select({ val: count() })
      .from(orders)
      .where(eq(orders.status, 'PENDING'))
    const pendingOrders = Number(pendingRes[0]?.val || 0)

    // 2. Daily Revenue (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const dailyRevOrders = await db
      .select({
        amount: orders.amount,
        paidAt: orders.paidAt,
      })
      .from(orders)
      .where(and(eq(orders.status, 'PAID'), gte(orders.paidAt, thirtyDaysAgo)))

    const dailyRevMap = new Map<string, number>()
    // Initialize map with last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      dailyRevMap.set(dateStr, 0)
    }
    for (const o of dailyRevOrders) {
      if (o.paidAt) {
        const dateStr = new Date(o.paidAt).toISOString().split('T')[0]
        if (dailyRevMap.has(dateStr)) {
          dailyRevMap.set(dateStr, dailyRevMap.get(dateStr)! + o.amount)
        }
      }
    }
    const dailyRevenue = Array.from(dailyRevMap.entries()).map(([date, amount]) => ({
      date,
      amount,
    }))

    // 3. New Users per Week
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
    const recentUsers = await db
      .select({ createdAt: users.createdAt })
      .from(users)
      .where(and(eq(users.role, 'USER'), gte(users.createdAt, fourWeeksAgo)))

    const weeklyUsersMap = new Map<string, number>()
    weeklyUsersMap.set('Week 1', 0)
    weeklyUsersMap.set('Week 2', 0)
    weeklyUsersMap.set('Week 3', 0)
    weeklyUsersMap.set('Week 4', 0)

    for (const u of recentUsers) {
      const diffMs = now.getTime() - new Date(u.createdAt).getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays < 7) {
        weeklyUsersMap.set('Week 4', weeklyUsersMap.get('Week 4')! + 1)
      } else if (diffDays < 14) {
        weeklyUsersMap.set('Week 3', weeklyUsersMap.get('Week 3')! + 1)
      } else if (diffDays < 21) {
        weeklyUsersMap.set('Week 2', weeklyUsersMap.get('Week 2')! + 1)
      } else if (diffDays < 28) {
        weeklyUsersMap.set('Week 1', weeklyUsersMap.get('Week 1')! + 1)
      }
    }
    const weeklyUsers = Array.from(weeklyUsersMap.entries()).map(([week, count]) => ({
      week,
      count,
    }))

    // 4. Package Sales Distribution (Donut)
    const pkgDistributionOrders = await db
      .select({
        packageName: packages.name,
      })
      .from(orders)
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(eq(orders.status, 'PAID'))

    const pkgMap = new Map<string, number>()
    for (const o of pkgDistributionOrders) {
      const name = o.packageName || 'UNKNOWN'
      pkgMap.set(name, (pkgMap.get(name) || 0) + 1)
    }
    const packageDistribution = Array.from(pkgMap.entries()).map(([name, count]) => ({
      name,
      value: count,
    }))

    // 5. Recent 5 Transactions
    const recentTransactions = await db
      .select({
        id: orders.id,
        userName: users.name,
        userEmail: users.email,
        packageName: packages.name,
        amount: orders.amount,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .orderBy(desc(orders.createdAt))
      .limit(5)

    // 6. Weddings expiring in 7 days
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const expiringWeddings = await db
      .select({
        id: weddings.id,
        slug: weddings.slug,
        expiredAt: weddings.expiredAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(weddings)
      .leftJoin(users, eq(weddings.userId, users.id))
      .where(and(gte(weddings.expiredAt, now), lte(weddings.expiredAt, sevenDaysFromNow)))
      .orderBy(weddings.expiredAt)

    return c.json({
      status: 'success',
      analytics: {
        kpis: {
          totalRevenueMonth,
          totalUsers,
          liveWeddings,
          pendingOrders,
        },
        dailyRevenue,
        weeklyUsers,
        packageDistribution,
        recentTransactions,
        expiringWeddings,
      },
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

// ==========================================
// 4.3 USER MANAGEMENT
// ==========================================
adminRouter.get('/users', async (c) => {
  try {
    const search = c.req.query('search') || ''
    const status = c.req.query('status') || 'all'
    const role = c.req.query('role') || 'all'

    let conditions: any[] = []

    if (search) {
      conditions.push(sql`(users.name ILIKE ${'%' + search + '%'} OR users.email ILIKE ${'%' + search + '%'})`)
    }
    if (status !== 'all') {
      conditions.push(eq(users.status, status))
    }
    if (role !== 'all') {
      conditions.push(eq(users.role, role))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))

    return c.json({ status: 'success', users: userList })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.get('/users/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const userDetail = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    if (!userDetail) {
      return c.json({ status: 'error', message: 'User tidak ditemukan.' }, 404)
    }

    const userOrders = await db
      .select({
        id: orders.id,
        packageName: packages.name,
        amount: orders.amount,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(eq(orders.userId, id))
      .orderBy(desc(orders.createdAt))

    const userWedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, id),
    })

    return c.json({
      status: 'success',
      user: {
        id: userDetail.id,
        name: userDetail.name,
        email: userDetail.email,
        role: userDetail.role,
        status: userDetail.status,
        createdAt: userDetail.createdAt,
      },
      orders: userOrders,
      wedding: userWedding || null,
    })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.put('/users/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const { status: targetStatus } = await c.req.json()

    if (!['ACTIVE', 'BLOCKED', 'PENDING'].includes(targetStatus)) {
      return c.json({ status: 'error', message: 'Status tidak valid.' }, 400)
    }

    await db.update(users).set({ status: targetStatus }).where(eq(users.id, id))

    return c.json({ status: 'success', message: 'Status user berhasil diperbarui.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.put('/users/:id/reset-password', async (c) => {
  try {
    const id = c.req.param('id')
    const { password } = await c.req.json()

    if (!password || password.length < 6) {
      return c.json({ status: 'error', message: 'Password minimal 6 karakter.' }, 400)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await db.update(users).set({ passwordHash }).where(eq(users.id, id))

    return c.json({ status: 'success', message: 'Password user berhasil direset.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.delete('/users/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await db.delete(users).where(eq(users.id, id))
    return c.json({ status: 'success', message: 'User berhasil dihapus.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

// ==========================================
// 4.4 ORDERS & TRANSACTIONS
// ==========================================
adminRouter.get('/orders', async (c) => {
  try {
    const status = c.req.query('status') || 'all'
    const search = c.req.query('search') || ''

    let conditions: any[] = []
    if (status !== 'all') {
      conditions.push(eq(orders.status, status))
    }
    if (search) {
      conditions.push(sql`(users.name ILIKE ${'%' + search + '%'} OR users.email ILIKE ${'%' + search + '%'})`)
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const orderList = await db
      .select({
        id: orders.id,
        amount: orders.amount,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
        packageName: packages.name,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(whereClause)
      .orderBy(desc(orders.createdAt))

    return c.json({ status: 'success', orders: orderList })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.get('/orders/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const orderDetail = await db
      .select({
        id: orders.id,
        amount: orders.amount,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
        packageName: packages.name,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(eq(orders.id, id))

    if (orderDetail.length === 0) {
      return c.json({ status: 'error', message: 'Order tidak ditemukan' }, 404)
    }

    const trxDetail = await db.query.transactions.findFirst({
      where: eq(transactions.orderId, id),
    })

    return c.json({
      status: 'success',
      order: orderDetail[0],
      transaction: trxDetail || null,
    })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.post('/orders/:id/confirm', async (c) => {
  try {
    const id = c.req.param('id')

    const orderRow = await db.query.orders.findFirst({
      where: eq(orders.id, id),
    })

    if (!orderRow) {
      return c.json({ status: 'error', message: 'Order tidak ditemukan' }, 404)
    }

    if (orderRow.status === 'PAID') {
      return c.json({ status: 'error', message: 'Order sudah dibayar sebelumnya.' }, 400)
    }

    // 1. Update order status to PAID
    await db
      .update(orders)
      .set({ status: 'PAID', paidAt: new Date() })
      .where(eq(orders.id, id))

    // 2. Update transaction status
    await db
      .update(transactions)
      .set({ status: 'success', gatewayRef: `MANUAL-${Date.now()}` })
      .where(eq(transactions.orderId, id))

    // 3. Activate user's wedding subscription
    const userWedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, orderRow.userId),
    })

    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, orderRow.packageId),
    })

    if (userWedding && pkg) {
      const expDate = new Date()
      expDate.setDate(expDate.getDate() + pkg.durationDays)

      await db
        .update(weddings)
        .set({
          expiredAt: expDate,
          status: 'published', // auto-publish upon confirmation
        })
        .where(eq(weddings.id, userWedding.id))
    }

    return c.json({ status: 'success', message: 'Pembayaran manual berhasil dikonfirmasi!' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.post('/orders/:id/cancel', async (c) => {
  try {
    const id = c.req.param('id')
    await db.update(orders).set({ status: 'EXPIRED' }).where(eq(orders.id, id))
    await db.update(transactions).set({ status: 'failed' }).where(eq(transactions.orderId, id))
    return c.json({ status: 'success', message: 'Order berhasil dibatalkan.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.post('/orders/:id/refund', async (c) => {
  try {
    const id = c.req.param('id')
    await db.update(orders).set({ status: 'REFUND' }).where(eq(orders.id, id))
    await db.update(transactions).set({ status: 'failed' }).where(eq(transactions.orderId, id))
    return c.json({ status: 'success', message: 'Order ditandai sebagai refund.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

// ==========================================
// 4.5 THEME MANAGEMENT (CMS)
// ==========================================
adminRouter.get('/themes', async (c) => {
  try {
    // Select all themes with usage statistics
    const themeList = await db.select().from(themes).orderBy(themes.id)

    // Count usage statistics in memory/JS for simplicity and safety
    const usageList = await db.select({ themeId: weddings.themeId, count: count() }).from(weddings).groupBy(weddings.themeId)
    const usageMap = new Map(usageList.map((u) => [u.themeId, u.count]))

    const formattedThemes = themeList.map((t) => ({
      ...t,
      usersCount: usageMap.get(t.id) || 0,
    }))

    return c.json({ status: 'success', themes: formattedThemes })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.post('/themes', async (c) => {
  try {
    const body = await c.req.json()
    const { id, name, thumbnailUrl, packageLevel } = body

    if (!id || !name) {
      return c.json({ status: 'error', message: 'ID dan Nama tema wajib diisi.' }, 400)
    }

    await db.insert(themes).values({
      id: id.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      name,
      thumbnailUrl: thumbnailUrl || '',
      packageLevel: packageLevel || 'BASIC',
      isActive: true,
    })

    return c.json({ status: 'success', message: 'Tema baru berhasil ditambahkan.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.put('/themes/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { name, thumbnailUrl, packageLevel, isActive } = body

    await db
      .update(themes)
      .set({
        name,
        thumbnailUrl,
        packageLevel,
        isActive,
      })
      .where(eq(themes.id, id))

    return c.json({ status: 'success', message: 'Tema berhasil diperbarui.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.delete('/themes/:id', async (c) => {
  try {
    const id = c.req.param('id')

    // Check if in use
    const inUse = await db.query.weddings.findFirst({
      where: eq(weddings.themeId, id),
    })

    if (inUse) {
      return c.json(
        {
          status: 'error',
          message: 'Gagal menghapus: Tema masih digunakan oleh satu atau beberapa undangan.',
        },
        400
      )
    }

    await db.delete(themes).where(eq(themes.id, id))
    return c.json({ status: 'success', message: 'Tema berhasil dihapus.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

// ==========================================
// 4.6 PACKAGE MANAGEMENT
// ==========================================
adminRouter.get('/packages', async (c) => {
  try {
    const list = await db.select().from(packages).orderBy(packages.price)
    return c.json({ status: 'success', packages: list })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.post('/packages', async (c) => {
  try {
    const body = await c.req.json()
    const { name, price, features, maxGuests, durationDays } = body

    if (!name || price === undefined || !durationDays) {
      return c.json({ status: 'error', message: 'Lengkapi seluruh data wajib paket.' }, 400)
    }

    await db.insert(packages).values({
      name: name.toUpperCase(),
      price: Number(price),
      features: features || [],
      maxGuests: Number(maxGuests || 0),
      durationDays: Number(durationDays),
    })

    return c.json({ status: 'success', message: 'Paket baru berhasil ditambahkan.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.put('/packages/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { name, price, features, maxGuests, durationDays } = body

    await db
      .update(packages)
      .set({
        name: name.toUpperCase(),
        price: Number(price),
        features,
        maxGuests: Number(maxGuests || 0),
        durationDays: Number(durationDays),
      })
      .where(eq(packages.id, id))

    return c.json({ status: 'success', message: 'Paket berhasil diperbarui.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

// ==========================================
// 4.7 MUSIC LIBRARY
// ==========================================
adminRouter.get('/music', async (c) => {
  try {
    const list = await db.select().from(music).orderBy(music.title)
    return c.json({ status: 'success', music: list })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.post('/music', async (c) => {
  try {
    const body = await c.req.json()
    const { title, artist, url } = body

    if (!title || !artist || !url) {
      return c.json({ status: 'error', message: 'Judul, artis, dan file URL wajib diisi.' }, 400)
    }

    await db.insert(music).values({
      title,
      artist,
      url,
      isActive: true,
    })

    return c.json({ status: 'success', message: 'Musik berhasil diunggah ke pustaka.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.put('/music/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { title, artist, isActive } = body

    await db
      .update(music)
      .set({
        title,
        artist,
        isActive,
      })
      .where(eq(music.id, id))

    return c.json({ status: 'success', message: 'Metadata musik berhasil diubah.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.delete('/music/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await db.delete(music).where(eq(music.id, id))
    return c.json({ status: 'success', message: 'Musik berhasil dihapus dari pustaka.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

// ==========================================
// 4.8 FINANCIAL REPORTS
// ==========================================
adminRouter.get('/finance', async (c) => {
  try {
    const start = c.req.query('start')
    const end = c.req.query('end')

    let conditions = [eq(orders.status, 'PAID')]
    if (start) {
      conditions.push(gte(orders.paidAt, new Date(start)))
    }
    if (end) {
      conditions.push(lte(orders.paidAt, new Date(end)))
    }

    const paidOrders = await db
      .select({
        id: orders.id,
        amount: orders.amount,
        paymentMethod: orders.paymentMethod,
        paidAt: orders.paidAt,
        packageName: packages.name,
      })
      .from(orders)
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(and(...conditions))
      .orderBy(desc(orders.paidAt))

    // Summary calculations
    let totalRevenue = 0
    const packageBreakdown = new Map<string, { count: number; sum: number }>()
    const methodBreakdown = new Map<string, { count: number; sum: number }>()

    for (const o of paidOrders) {
      totalRevenue += o.amount

      const pkgName = o.packageName || 'UNKNOWN'
      const pData = packageBreakdown.get(pkgName) || { count: 0, sum: 0 }
      packageBreakdown.set(pkgName, { count: pData.count + 1, sum: pData.sum + o.amount })

      const method = o.paymentMethod || 'UNKNOWN'
      const mData = methodBreakdown.get(method) || { count: 0, sum: 0 }
      methodBreakdown.set(method, { count: mData.count + 1, sum: mData.sum + o.amount })
    }

    return c.json({
      status: 'success',
      report: {
        totalRevenue,
        ordersCount: paidOrders.length,
        packageBreakdown: Array.from(packageBreakdown.entries()).map(([name, val]) => ({ name, ...val })),
        methodBreakdown: Array.from(methodBreakdown.entries()).map(([name, val]) => ({ name, ...val })),
        orders: paidOrders,
      },
    })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

// ==========================================
// 4.9 SYSTEM CONFIGURATION
// ==========================================
adminRouter.get('/settings', async (c) => {
  try {
    const list = await db.select().from(systemSettings)
    const settingsMap = list.reduce((acc: any, cur) => {
      acc[cur.key] = cur.value
      return acc
    }, {})

    return c.json({ status: 'success', settings: settingsMap })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.put('/settings', async (c) => {
  try {
    const body = await c.req.json()

    for (const [key, value] of Object.entries(body)) {
      await db
        .insert(systemSettings)
        .values({
          key,
          value,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value,
            updatedAt: new Date(),
          },
        })
    }

    return c.json({ status: 'success', message: 'Konfigurasi sistem berhasil diperbarui.' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

adminRouter.post('/settings/test-email', async (c) => {
  try {
    const { smtp, testEmail } = await c.req.json()
    if (!testEmail) {
      return c.json({ status: 'error', message: 'Email tujuan wajib diisi.' }, 400)
    }

    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: Number(smtp.port),
      secure: Number(smtp.port) === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    })

    await transporter.sendMail({
      from: smtp.from || 'noreply@ngaturi.id',
      to: testEmail,
      subject: 'Test Email Konfigurasi SMTP Ngaturi',
      text: 'Selamat! Konfigurasi SMTP Anda berjalan dengan lancar.',
      html: '<h3>Ngaturi SaaS</h3><p>Selamat! Konfigurasi SMTP Anda berjalan dengan lancar.</p>',
    })

    return c.json({ status: 'success', message: 'Test email berhasil dikirim!' })
  } catch (error: any) {
    console.error('Test email failed:', error)
    return c.json({ status: 'error', message: `Gagal mengirim email: ${error.message}` }, 500)
  }
})

export default adminRouter
