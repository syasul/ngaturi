import { Hono } from 'hono'
import { db, eq } from '../db'
import { themes } from '../db/schema'

const themesRouter = new Hono()

themesRouter.get('/', async (c) => {
  try {
    const list = await db.query.themes.findMany({
      where: eq(themes.isActive, true),
    })
    return c.json({ status: 'success', themes: list })
  } catch (error: any) {
    console.error('Error fetching themes:', error)
    return c.json({ status: 'error', message: 'Gagal mengambil daftar tema.' }, 500)
  }
})

export default themesRouter
