import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:postgres@localhost:5433/wedding_online'

export const client = postgres(connectionString)
export const db = drizzle(client, { schema })

export * from './schema'
export * from 'drizzle-orm'
