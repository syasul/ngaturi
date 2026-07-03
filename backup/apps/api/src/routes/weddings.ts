import { Hono } from 'hono'
import { db, eq, and, desc, not } from '../db'
import { weddings, themes, orders, packages, guests, photos } from '../db/schema'
import { requireAuth } from '../middleware/auth'

const weddingsRouter = new Hono()

// --- PUBLIC ROUTES ---

// 1. GET /weddings/public/:slug - Get public wedding details
weddingsRouter.get('/public/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const list = await db
      .select({
        id: weddings.id,
        userId: weddings.userId,
        slug: weddings.slug,
        status: weddings.status,
        data: weddings.data,
        expiredAt: weddings.expiredAt,
        createdAt: weddings.createdAt,
        themeId: themes.id,
        themeName: themes.name,
      })
      .from(weddings)
      .leftJoin(themes, eq(weddings.themeId, themes.id))
      .where(eq(weddings.slug, slug.toLowerCase()))
      .limit(1)

    if (list.length === 0) {
      return c.json({ status: 'error', message: 'Undangan tidak ditemukan.' }, 404)
    }

    const wedding = list[0]

    // Fetch associated photos
    const weddingPhotos = await db
      .select()
      .from(photos)
      .where(eq(photos.weddingId, wedding.id))
      .orderBy(photos.order)

    return c.json({
      status: 'success',
      wedding: {
        ...wedding,
        photos: weddingPhotos,
      },
    })
  } catch (error: any) {
    console.error('Error fetching public wedding:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil data undangan.' }, 500)
  }
})

// 2. GET /weddings/check-slug/:slug - Check if slug is available
weddingsRouter.get('/check-slug/:slug', async (c) => {
  const slug = c.req.param('slug').toLowerCase()
  
  // Basic validation: alphanumeric and dashes only
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return c.json({ status: 'success', available: false, message: 'Format slug tidak valid' })
  }

  try {
    const existing = await db.query.weddings.findFirst({
      where: eq(weddings.slug, slug),
    })
    return c.json({ status: 'success', available: !existing })
  } catch (error: any) {
    console.error('Error checking slug:', error)
    return c.json({ status: 'error', message: 'Gagal memeriksa ketersediaan URL.' }, 500)
  }
})

// --- PRIVATE ROUTES ---
weddingsRouter.use('*', requireAuth)

// 3. GET /weddings/me - Get user's current wedding
weddingsRouter.get('/me', async (c) => {
  const user = c.get('user')
  try {
    const myWedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!myWedding) {
      return c.json({ status: 'success', wedding: null })
    }

    // Load user package details from latest paid order
    const latestPaidOrder = await db
      .select({
        packageName: packages.name,
        maxGuests: packages.maxGuests,
        features: packages.features,
      })
      .from(orders)
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(and(eq(orders.userId, user.id), eq(orders.status, 'PAID')))
      .orderBy(desc(orders.createdAt))
      .limit(1)

    const userPackage = latestPaidOrder[0] || {
      packageName: 'BASIC',
      maxGuests: 100,
      features: [],
    }

    // Fetch photos
    const weddingPhotos = await db
      .select()
      .from(photos)
      .where(eq(photos.weddingId, myWedding.id))
      .orderBy(photos.order)

    return c.json({
      status: 'success',
      wedding: {
        ...myWedding,
        photos: weddingPhotos,
        package: userPackage,
      },
    })
  } catch (error: any) {
    console.error('Error fetching my wedding:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil data undangan Anda.' }, 500)
  }
})

// 4. POST /weddings - Create a wedding
weddingsRouter.post('/', async (c) => {
  const user = c.get('user')
  try {
    const { slug, themeId } = await c.req.json()

    if (!slug || !themeId) {
      return c.json({ status: 'error', message: 'Slug URL dan Tema wajib diisi.' }, 400)
    }

    const normalizedSlug = slug.toLowerCase()

    // Check if slug taken
    const existing = await db.query.weddings.findFirst({
      where: eq(weddings.slug, normalizedSlug),
    })

    if (existing) {
      return c.json({ status: 'error', message: 'Slug URL sudah digunakan.' }, 400)
    }

    // Check if user already has a wedding
    const hasWedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (hasWedding) {
      return c.json({ status: 'error', message: 'Anda sudah membuat undangan.' }, 400)
    }

    // Get package expiration duration
    const latestPaidOrder = await db
      .select({ durationDays: packages.durationDays })
      .from(orders)
      .leftJoin(packages, eq(orders.packageId, packages.id))
      .where(and(eq(orders.userId, user.id), eq(orders.status, 'PAID')))
      .orderBy(desc(orders.createdAt))
      .limit(1)

    const durationDays = latestPaidOrder[0]?.durationDays || 90
    const expiredAt = new Date()
    expiredAt.setDate(expiredAt.getDate() + durationDays)

    const [newWedding] = await db
      .insert(weddings)
      .values({
        userId: user.id,
        slug: normalizedSlug,
        themeId,
        status: 'draft',
        expiredAt,
        data: {},
      })
      .returning()

    return c.json({
      status: 'success',
      message: 'Undangan berhasil dibuat.',
      wedding: newWedding,
    })
  } catch (error: any) {
    console.error('Create wedding error:', error)
    return c.json({ status: 'error', message: 'Gagal membuat undangan.' }, 500)
  }
})

// 5. PUT /weddings/me - Update wedding details
weddingsRouter.put('/me', async (c) => {
  const user = c.get('user')
  try {
    const { data } = await c.req.json()

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Undangan tidak ditemukan.' }, 404)
    }

    const [updated] = await db
      .update(weddings)
      .set({ data, createdAt: wedding.createdAt }) // Keep createdAt
      .where(eq(weddings.id, wedding.id))
      .returning()

    return c.json({
      status: 'success',
      message: 'Undangan berhasil disimpan.',
      wedding: updated,
    })
  } catch (error: any) {
    console.error('Update wedding error:', error)
    return c.json({ status: 'error', message: 'Gagal menyimpan detail undangan.' }, 500)
  }
})

// 6. PUT /weddings/me/slug - Change wedding slug
weddingsRouter.put('/me/slug', async (c) => {
  const user = c.get('user')
  try {
    const { slug } = await c.req.json()

    if (!slug) {
      return c.json({ status: 'error', message: 'Slug URL wajib diisi.' }, 400)
    }

    const normalizedSlug = slug.toLowerCase()

    if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
      return c.json({ status: 'error', message: 'Format URL tidak valid.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Undangan tidak ditemukan.' }, 404)
    }

    // Check uniqueness
    const taken = await db.query.weddings.findFirst({
      where: and(
        eq(weddings.slug, normalizedSlug),
        not(eq(weddings.id, wedding.id))
      ),
    })

    if (taken) {
      return c.json({ status: 'error', message: 'Slug URL sudah digunakan oleh pengguna lain.' }, 400)
    }

    const [updated] = await db
      .update(weddings)
      .set({ slug: normalizedSlug })
      .where(eq(weddings.id, wedding.id))
      .returning()

    return c.json({
      status: 'success',
      message: 'URL Undangan berhasil diubah.',
      wedding: updated,
    })
  } catch (error: any) {
    console.error('Change slug error:', error)
    return c.json({ status: 'error', message: 'Gagal mengubah URL.' }, 500)
  }
})

// 7. PUT /weddings/me/theme - Change wedding theme
weddingsRouter.put('/me/theme', async (c) => {
  const user = c.get('user')
  try {
    const { themeId } = await c.req.json()

    if (!themeId) {
      return c.json({ status: 'error', message: 'Tema wajib dipilih.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Undangan tidak ditemukan.' }, 404)
    }

    const [updated] = await db
      .update(weddings)
      .set({ themeId })
      .where(eq(weddings.id, wedding.id))
      .returning()

    return c.json({
      status: 'success',
      message: 'Tema berhasil diubah.',
      wedding: updated,
    })
  } catch (error: any) {
    console.error('Change theme error:', error)
    return c.json({ status: 'error', message: 'Gagal mengubah tema.' }, 500)
  }
})

// 8. PUT /weddings/me/status - Toggle draft/publish status
weddingsRouter.put('/me/status', async (c) => {
  const user = c.get('user')
  try {
    const { status } = await c.req.json()

    if (status !== 'draft' && status !== 'published') {
      return c.json({ status: 'error', message: 'Status tidak valid.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Undangan tidak ditemukan.' }, 404)
    }

    const [updated] = await db
      .update(weddings)
      .set({ status })
      .where(eq(weddings.id, wedding.id))
      .returning()

    return c.json({
      status: 'success',
      message: status === 'published' ? 'Undangan berhasil diterbitkan!' : 'Undangan berhasil diubah ke draft.',
      wedding: updated,
    })
  } catch (error: any) {
    console.error('Toggle status error:', error)
    return c.json({ status: 'error', message: 'Gagal mengubah status publikasi.' }, 500)
  }
})

// 9. DELETE /weddings/me - Delete wedding
weddingsRouter.delete('/me', async (c) => {
  const user = c.get('user')
  try {
    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Undangan tidak ditemukan.' }, 404)
    }

    await db.delete(weddings).where(eq(weddings.id, wedding.id))

    return c.json({
      status: 'success',
      message: 'Undangan berhasil dihapus.',
    })
  } catch (error: any) {
    console.error('Delete wedding error:', error)
    return c.json({ status: 'error', message: 'Gagal menghapus undangan.' }, 500)
  }
})

export default weddingsRouter
