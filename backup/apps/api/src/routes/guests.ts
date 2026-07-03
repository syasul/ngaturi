import { Hono } from 'hono'
import { db, eq, and, desc, inArray, like, sql, isNotNull } from '../db'
import { guests, weddings } from '../db/schema'
import { requireAuth } from '../middleware/auth'

const guestsRouter = new Hono()

// --- PUBLIC ROUTES ---

// 1. GET /guests/public/wishes/:weddingId - Get public visible wishes
guestsRouter.get('/public/wishes/:weddingId', async (c) => {
  const weddingId = c.req.param('weddingId')
  try {
    const list = await db
      .select({
        id: guests.id,
        name: guests.name,
        rsvpStatus: guests.rsvpStatus,
        message: guests.message,
        createdAt: guests.createdAt,
      })
      .from(guests)
      .where(
        and(
          eq(guests.weddingId, weddingId),
          eq(guests.isMessageVisible, true),
          isNotNull(guests.message)
        )
      )
      .orderBy(desc(guests.createdAt))

    return c.json({ status: 'success', wishes: list })
  } catch (error: any) {
    console.error('Error fetching public wishes:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil ucapan tamu.' }, 500)
  }
})

// 2. GET /guests/public/by-token/:token - Get guest by token
guestsRouter.get('/public/by-token/:token', async (c) => {
  const token = c.req.param('token')
  try {
    const guest = await db.query.guests.findFirst({
      where: eq(guests.uniqueToken, token),
    })

    if (!guest) {
      return c.json({ status: 'error', message: 'Tamu tidak ditemukan.' }, 404)
    }

    return c.json({ status: 'success', guest })
  } catch (error: any) {
    console.error('Error fetching guest by token:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil data tamu.' }, 500)
  }
})

// 3. POST /guests/public/rsvp - Submit RSVP from public page
guestsRouter.post('/public/rsvp', async (c) => {
  try {
    const { uniqueToken, rsvpStatus, message } = await c.req.json()

    if (!uniqueToken || !rsvpStatus) {
      return c.json({ status: 'error', message: 'Token dan Status RSVP wajib diisi.' }, 400)
    }

    const guest = await db.query.guests.findFirst({
      where: eq(guests.uniqueToken, uniqueToken),
    })

    if (!guest) {
      return c.json({ status: 'error', message: 'Data tamu tidak valid.' }, 400)
    }

    const [updated] = await db
      .update(guests)
      .set({
        rsvpStatus,
        message: message || null,
        isMessageVisible: true, // Default visible upon new submission
      })
      .where(eq(guests.id, guest.id))
      .returning()

    return c.json({
      status: 'success',
      message: 'Konfirmasi kehadiran berhasil dikirim.',
      guest: updated,
    })
  } catch (error: any) {
    console.error('Submit public RSVP error:', error)
    return c.json({ status: 'error', message: 'Gagal mengirim konfirmasi kehadiran.' }, 500)
  }
})

// --- PRIVATE ROUTES ---
guestsRouter.use('*', requireAuth)

// 4. GET /guests - Get guests for current user's wedding
guestsRouter.get('/', async (c) => {
  const user = c.get('user')
  const searchQuery = c.req.query('q') || ''
  try {
    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'success', guests: [] })
    }

    const whereClause = searchQuery
      ? and(eq(guests.weddingId, wedding.id), like(guests.name, `%${searchQuery}%`))
      : eq(guests.weddingId, wedding.id)

    const list = await db
      .select()
      .from(guests)
      .where(whereClause)
      .orderBy(desc(guests.createdAt))

    return c.json({ status: 'success', guests: list })
  } catch (error: any) {
    console.error('Error fetching guests:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil daftar tamu.' }, 500)
  }
})

// 5. GET /guests/stats - Get RSVP and Wishes analytics
guestsRouter.get('/stats', async (c) => {
  const user = c.get('user')
  try {
    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({
        status: 'success',
        stats: { total: 0, attending: 0, declined: 0, tentative: 0, pending: 0 },
      })
    }

    const stats = await db
      .select({
        status: guests.rsvpStatus,
        count: sql<number>`count(${guests.id})::int`,
      })
      .from(guests)
      .where(eq(guests.weddingId, wedding.id))
      .groupBy(guests.rsvpStatus)

    const result = {
      total: 0,
      attending: 0,
      declined: 0,
      tentative: 0, // 'ragu-ragu'
      pending: 0,
    }

    stats.forEach((row) => {
      const count = row.count || 0
      result.total += count
      if (row.status === 'attending' || row.status === 'hadir') {
        result.attending += count
      } else if (row.status === 'declined' || row.status === 'tidak hadir') {
        result.declined += count
      } else if (row.status === 'tentative' || row.status === 'ragu-ragu') {
        result.tentative += count
      } else {
        result.pending += count
      }
    })

    return c.json({ status: 'success', stats: result })
  } catch (error: any) {
    console.error('Error fetching guest stats:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil statistik tamu.' }, 500)
  }
})

// 6. POST /guests - Add guest manually
guestsRouter.post('/', async (c) => {
  const user = c.get('user')
  try {
    const { name, phone } = await c.req.json()

    if (!name) {
      return c.json({ status: 'error', message: 'Nama tamu wajib diisi.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Buat undangan Anda terlebih dahulu.' }, 400)
    }

    const uniqueToken = crypto.randomUUID().split('-')[0] + '-' + Math.random().toString(36).substring(2, 6)

    const [newGuest] = await db
      .insert(guests)
      .values({
        weddingId: wedding.id,
        name,
        phone: phone || null,
        uniqueToken,
        rsvpStatus: 'pending',
      })
      .returning()

    return c.json({
      status: 'success',
      message: 'Tamu berhasil ditambahkan.',
      guest: newGuest,
    })
  } catch (error: any) {
    console.error('Add guest error:', error)
    return c.json({ status: 'error', message: 'Gagal menambahkan tamu.' }, 500)
  }
})

// 7. POST /guests/import - Bulk import guests from CSV data
guestsRouter.post('/import', async (c) => {
  const user = c.get('user')
  try {
    const { guests: guestList } = await c.req.json()

    if (!Array.isArray(guestList) || guestList.length === 0) {
      return c.json({ status: 'error', message: 'Daftar tamu kosong atau format tidak valid.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Buat undangan Anda terlebih dahulu.' }, 400)
    }

    const valuesToInsert = guestList.map((g: any) => {
      const uniqueToken = crypto.randomUUID().split('-')[0] + '-' + Math.random().toString(36).substring(2, 6)
      return {
        weddingId: wedding.id,
        name: g.name,
        phone: g.phone || null,
        uniqueToken,
        rsvpStatus: 'pending',
      }
    })

    const inserted = await db.insert(guests).values(valuesToInsert).returning()

    return c.json({
      status: 'success',
      message: `${inserted.length} tamu berhasil diimport.`,
      guests: inserted,
    })
  } catch (error: any) {
    console.error('Import guests error:', error)
    return c.json({ status: 'error', message: 'Gagal mengimport daftar tamu.' }, 500)
  }
})

// 8. PUT /guests/:id - Update guest info (including RSVP / wish visibility moderation)
guestsRouter.put('/:id', async (c) => {
  const user = c.get('user')
  const guestId = c.req.param('id')
  try {
    const { name, phone, rsvpStatus, message, isMessageVisible } = await c.req.json()

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Akses ditolak.' }, 403)
    }

    const guest = await db.query.guests.findFirst({
      where: and(eq(guests.id, guestId), eq(guests.weddingId, wedding.id)),
    })

    if (!guest) {
      return c.json({ status: 'error', message: 'Tamu tidak ditemukan.' }, 404)
    }

    const updateFields: any = {}
    if (name !== undefined) updateFields.name = name
    if (phone !== undefined) updateFields.phone = phone
    if (rsvpStatus !== undefined) updateFields.rsvpStatus = rsvpStatus
    if (message !== undefined) updateFields.message = message
    if (isMessageVisible !== undefined) updateFields.isMessageVisible = isMessageVisible

    const [updated] = await db
      .update(guests)
      .set(updateFields)
      .where(eq(guests.id, guestId))
      .returning()

    return c.json({
      status: 'success',
      message: 'Data tamu berhasil diperbarui.',
      guest: updated,
    })
  } catch (error: any) {
    console.error('Update guest error:', error)
    return c.json({ status: 'error', message: 'Gagal memperbarui data tamu.' }, 500)
  }
})

// 9. DELETE /guests/:id - Delete guest
guestsRouter.delete('/:id', async (c) => {
  const user = c.get('user')
  const guestId = c.req.param('id')
  try {
    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Akses ditolak.' }, 403)
    }

    const deleted = await db
      .delete(guests)
      .where(and(eq(guests.id, guestId), eq(guests.weddingId, wedding.id)))
      .returning()

    if (deleted.length === 0) {
      return c.json({ status: 'error', message: 'Tamu tidak ditemukan.' }, 404)
    }

    return c.json({ status: 'success', message: 'Tamu berhasil dihapus.' })
  } catch (error: any) {
    console.error('Delete guest error:', error)
    return c.json({ status: 'error', message: 'Gagal menghapus tamu.' }, 500)
  }
})

// 10. POST /guests/bulk-delete - Delete multiple guests
guestsRouter.post('/bulk-delete', async (c) => {
  const user = c.get('user')
  try {
    const { ids } = await c.req.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json({ status: 'error', message: 'Pilih tamu yang ingin dihapus.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Akses ditolak.' }, 403)
    }

    const deleted = await db
      .delete(guests)
      .where(and(inArray(guests.id, ids), eq(guests.weddingId, wedding.id)))
      .returning()

    return c.json({
      status: 'success',
      message: `${deleted.length} tamu berhasil dihapus.`,
    })
  } catch (error: any) {
    console.error('Bulk delete guests error:', error)
    return c.json({ status: 'error', message: 'Gagal menghapus beberapa tamu.' }, 500)
  }
})

// 11. POST /guests/checkin - QR Scan attendance verification
guestsRouter.post('/checkin', async (c) => {
  const user = c.get('user')
  try {
    const { uniqueToken } = await c.req.json()

    if (!uniqueToken) {
      return c.json({ status: 'error', message: 'Token QR Code wajib diisi.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Undangan tidak ditemukan.' }, 404)
    }

    const guest = await db.query.guests.findFirst({
      where: and(eq(guests.uniqueToken, uniqueToken), eq(guests.weddingId, wedding.id)),
    })

    if (!guest) {
      return c.json({ status: 'error', message: 'Token QR Code tidak valid untuk undangan Anda.' }, 400)
    }

    // Check if guest is already checked in
    const alreadyAttending = guest.rsvpStatus === 'attending' || guest.rsvpStatus === 'hadir'

    const [updated] = await db
      .update(guests)
      .set({ rsvpStatus: 'attending' })
      .where(eq(guests.id, guest.id))
      .returning()

    return c.json({
      status: 'success',
      message: alreadyAttending
        ? `${guest.name} sudah melakukan check-in sebelumnya.`
        : `${guest.name} berhasil check-in kehadiran!`,
      guest: updated,
    })
  } catch (error: any) {
    console.error('Reception QR checkin error:', error)
    return c.json({ status: 'error', message: 'Gagal memproses check-in QR Code.' }, 500)
  }
})

export default guestsRouter
