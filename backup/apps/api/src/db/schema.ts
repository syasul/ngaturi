import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core'

// 1. Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('USER').notNull(), // 'USER', 'ADMIN'
  status: varchar('status', { length: 50 }).default('PENDING').notNull(), // 'PENDING', 'ACTIVE', 'BLOCKED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 2. Packages Table
export const packages = pgTable('packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(), // 'BASIC', 'PREMIUM', 'CUSTOM'
  price: integer('price').notNull(),
  features: jsonb('features').$type<string[]>().default([]).notNull(), // JSON list of features
  maxGuests: integer('max_guests').notNull(),
  durationDays: integer('duration_days').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 3. Orders Table
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  packageId: uuid('package_id')
    .references(() => packages.id)
    .notNull(),
  status: varchar('status', { length: 50 }).default('PENDING').notNull(), // 'PENDING', 'PAID', 'EXPIRED', 'REFUND'
  amount: integer('amount').notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 4. Themes Table
export const themes = pgTable('themes', {
  id: varchar('id', { length: 100 }).primaryKey(), // 'elegant', 'rustic', 'modern'
  name: varchar('name', { length: 255 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  isActive: boolean('is_active').default(true).notNull(),
  packageLevel: varchar('package_level', { length: 50 })
    .default('BASIC')
    .notNull(), // 'BASIC', 'PREMIUM'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 5. Weddings Table
export const weddings = pgTable('weddings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  themeId: varchar('theme_id', { length: 100 })
    .references(() => themes.id)
    .notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('draft').notNull(), // 'draft', 'published'
  data: jsonb('data').$type<Record<string, any>>().default({}).notNull(), // Wedding details (groom, bride, schedule, stories)
  expiredAt: timestamp('expired_at'),
  expirationWarningSentAt: timestamp('expiration_warning_sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 6. Guests Table
export const guests = pgTable('guests', {
  id: uuid('id').defaultRandom().primaryKey(),
  weddingId: uuid('wedding_id')
    .references(() => weddings.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  uniqueToken: varchar('unique_token', { length: 100 }).notNull().unique(),
  rsvpStatus: varchar('rsvp_status', { length: 50 })
    .default('pending')
    .notNull(), // 'pending', 'attending', 'declined'
  message: text('message'),
  isMessageVisible: boolean('is_message_visible').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 7. Photos Table
export const photos = pgTable('photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  weddingId: uuid('wedding_id')
    .references(() => weddings.id, { onDelete: 'cascade' })
    .notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  order: integer('order').default(0).notNull(),
  type: varchar('type', { length: 50 }).default('gallery').notNull(), // 'gallery', 'cover'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 8. Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  gatewayRef: varchar('gateway_ref', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull(), // 'pending', 'success', 'failed'
  payload: jsonb('payload').$type<Record<string, any>>().default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 9. Music Table
export const music = pgTable('music', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 10. System Settings Table
export const systemSettings = pgTable('system_settings', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: jsonb('value').$type<any>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
