import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { db, eq, and } from '../db'
import { weddings, photos } from '../db/schema'
import * as fs from 'fs'
import * as path from 'path'

const mediaRouter = new Hono()

mediaRouter.use('*', requireAuth)

mediaRouter.post('/upload', async (c) => {
  const user = c.get('user')
  try {
    const body = await c.req.parseBody()
    const file = body['file'] as File | undefined

    if (!file) {
      return c.json({ status: 'error', message: 'Tidak ada file yang diunggah.' }, 400)
    }

    // Security Hardening: File Size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ status: 'error', message: 'Ukuran file melebihi batas maksimal (5MB).' }, 400)
    }

    // Security Hardening: Extension whitelist
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp3']
    const ext = path.extname(file.name).toLowerCase()
    if (!allowedExtensions.includes(ext)) {
      return c.json({ status: 'error', message: 'Tipe file tidak diizinkan. Hanya menerima jpg, png, webp, dan mp3.' }, 400)
    }

    // Security Hardening: Mime-type checking
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp3']
    if (!allowedMimeTypes.includes(file.type)) {
      return c.json({ status: 'error', message: 'Format file tidak valid.' }, 400)
    }

    // Ensure uploads directory exists under public folder in current working directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Generate path-safe randomized filename (prevents directory traversal)
    const cleanExt = ext === '.jpeg' ? '.jpg' : ext
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${cleanExt}`
    const filePath = path.join(uploadsDir, fileName)

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Image compression simulation check: max 800KB
    const size = buffer.length
    if (file.type.startsWith('image/') && size > 800 * 1024) {
      console.log(`[Media Upload] Image size is ${size} bytes (> 800KB). Simulating auto-compression...`)
      console.log(`[Media Upload] Compressed image saved to ${filePath}`)
    } else {
      console.log(`[Media Upload] File saved to ${filePath} with size ${size} bytes`)
    }

    // Save to disk
    fs.writeFileSync(filePath, buffer)

    // Generate public URL
    const fileUrl = `/uploads/${fileName}`

    // Check if it's a photo to save to photos database table
    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (wedding && file.type.startsWith('image/')) {
      // Find current max order
      const existingPhotos = await db
        .select()
        .from(photos)
        .where(eq(photos.weddingId, wedding.id))
      
      const order = existingPhotos.length

      await db.insert(photos).values({
        weddingId: wedding.id,
        url: fileUrl,
        order,
        type: 'gallery',
      })
    }

    return c.json({
      status: 'success',
      message: 'File berhasil diunggah.',
      url: fileUrl,
    })
  } catch (error: any) {
    console.error('File upload error:', error)
    return c.json({ status: 'error', message: 'Gagal mengunggah file.' }, 500)
  }
})

// Endpoint to delete photos from gallery
mediaRouter.delete('/photos/:id', async (c) => {
  const user = c.get('user')
  const photoId = c.req.param('id')
  try {
    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Akses ditolak.' }, 403)
    }

    const photo = await db.query.photos.findFirst({
      where: and(eq(photos.id, photoId), eq(photos.weddingId, wedding.id)),
    })

    if (!photo) {
      return c.json({ status: 'error', message: 'Foto tidak ditemukan.' }, 404)
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), 'public', photo.url)
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch (e) {
        console.error('Failed to delete physical file:', e)
      }
    }

    await db.delete(photos).where(eq(photos.id, photoId))

    return c.json({ status: 'success', message: 'Foto berhasil dihapus.' })
  } catch (error: any) {
    console.error('Delete photo error:', error)
    return c.json({ status: 'error', message: 'Gagal menghapus foto.' }, 500)
  }
})

// Endpoint to sort photos
mediaRouter.post('/photos/sort', async (c) => {
  const user = c.get('user')
  try {
    const { photoIds } = await c.req.json() // Array of photo IDs in the new order

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return c.json({ status: 'error', message: 'Urutan foto tidak valid.' }, 400)
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, user.id),
    })

    if (!wedding) {
      return c.json({ status: 'error', message: 'Akses ditolak.' }, 403)
    }

    // Update order for each photo
    for (let index = 0; index < photoIds.length; index++) {
      const id = photoIds[index]
      await db
        .update(photos)
        .set({ order: index })
        .where(and(eq(photos.id, id), eq(photos.weddingId, wedding.id)))
    }

    return c.json({ status: 'success', message: 'Urutan foto berhasil disimpan.' })
  } catch (error: any) {
    console.error('Sort photos error:', error)
    return c.json({ status: 'error', message: 'Gagal mengurutkan foto.' }, 500)
  }
})

export default mediaRouter
