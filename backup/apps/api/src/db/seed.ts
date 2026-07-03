import bcrypt from 'bcryptjs'
import { db } from './index'
import {
  packages,
  themes,
  users,
  music,
  systemSettings,
  orders,
  transactions,
  weddings,
  guests,
} from './schema'

async function main() {
  console.log('Seeding packages...')

  // 1. Seed Packages
  const defaultPackages = [
    {
      name: 'BASIC',
      price: 150000,
      features: [
        'Standard Themes (Elegant & Rustic)',
        'Digital Guestbook',
        'RSVPs & Wishes Board',
        'Google Maps Integration',
        'Up to 100 Guest Invitations',
        '90 Days Active Invitation',
      ],
      maxGuests: 100,
      durationDays: 90,
    },
    {
      name: 'PREMIUM',
      price: 299000,
      features: [
        'All Themes (including Modern Minimalist)',
        'Premium Photo Gallery (up to 20 photos)',
        'YouTube / Vimeo Video Embed',
        'Custom Audio/Backsound MP3 Upload',
        'Digital QR Code Reception Check-in',
        'Up to 1000 Guest Invitations',
        '365 Days Active Invitation',
        'Priority Customer Support',
        'Ad-Free Invitation Page',
      ],
      maxGuests: 1000,
      durationDays: 365,
    },
  ]

  const seededPackages: any[] = []
  for (const pkg of defaultPackages) {
    const res = await db
      .insert(packages)
      .values(pkg)
      .onConflictDoUpdate({
        target: packages.name,
        set: {
          price: pkg.price,
          features: pkg.features,
          maxGuests: pkg.maxGuests,
          durationDays: pkg.durationDays,
        },
      })
      .returning()
    seededPackages.push(res[0])
  }

  const basicPkg = seededPackages.find((p) => p.name === 'BASIC')
  const premiumPkg = seededPackages.find((p) => p.name === 'PREMIUM')

  console.log('Seeding themes...')

  // 2. Seed Themes
  const defaultThemes = [
    {
      id: 'elegant',
      name: 'Elegant Gold',
      thumbnailUrl: '/themes/elegant.jpg',
      isActive: true,
      packageLevel: 'BASIC',
    },
    {
      id: 'rustic',
      name: 'Rustic Blossom',
      thumbnailUrl: '/themes/rustic.jpg',
      isActive: true,
      packageLevel: 'BASIC',
    },
    {
      id: 'modern',
      name: 'Modern Minimalist',
      thumbnailUrl: '/themes/modern.jpg',
      isActive: true,
      packageLevel: 'PREMIUM',
    },
  ]

  for (const theme of defaultThemes) {
    await db
      .insert(themes)
      .values(theme)
      .onConflictDoUpdate({
        target: themes.id,
        set: {
          name: theme.name,
          thumbnailUrl: theme.thumbnailUrl,
          isActive: theme.isActive,
          packageLevel: theme.packageLevel,
        },
      })
  }

  console.log('Seeding admin user...')

  // 3. Seed Admin User
  const adminEmail = 'admin@ngaturi.id'
  const adminPasswordHash = bcrypt.hashSync('admin123', 10)

  // Clean up any existing admin user to prevent duplication
  await db.insert(users)
    .values({
      email: adminEmail,
      name: 'Ngaturi Administrator',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        passwordHash: adminPasswordHash,
        name: 'Ngaturi Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
      }
    })

  console.log('Seeding system settings...')

  // 4. Seed default settings
  const defaultSettings = [
    {
      key: 'smtp',
      value: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        user: 'mock-username',
        pass: 'mock-password',
        from: 'noreply@ngaturi.id',
      },
    },
    {
      key: 'payment_gateway',
      value: {
        provider: 'midtrans',
        merchantId: 'M000001',
        clientKey: 'SB-Mid-client-mock',
        serverKey: 'SB-Mid-server-mock',
        isSandbox: true,
      },
    },
    {
      key: 'storage',
      value: {
        provider: 'local',
        bucket: 'uploads',
        endpoint: '',
        accessKeyId: '',
        secretAccessKey: '',
      },
    },
    {
      key: 'notifications',
      value: {
        telegramEnabled: false,
        telegramBotToken: '',
        telegramChatId: '',
        emailOnOrder: true,
      },
    },
    {
      key: 'maintenance_mode',
      value: {
        enabled: false,
        message: 'Website kami sedang dalam pemeliharaan sistem. Silakan kembali beberapa saat lagi.',
      },
    },
  ]

  for (const setting of defaultSettings) {
    await db
      .insert(systemSettings)
      .values({
        key: setting.key,
        value: setting.value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: setting.value,
          updatedAt: new Date(),
        },
      })
  }

  console.log('Seeding music library...')

  // 5. Seed Music Library
  const defaultMusic = [
    {
      title: 'A Thousand Years',
      artist: 'Christina Perri',
      url: '/uploads/a_thousand_years.mp3',
      isActive: true,
    },
    {
      title: 'Marry Me',
      artist: 'Train',
      url: '/uploads/marry_me.mp3',
      isActive: true,
    },
    {
      title: 'Beautiful in White',
      artist: 'Westlife',
      url: '/uploads/beautiful_in_white.mp3',
      isActive: true,
    },
  ]

  // Clear music to seed freshly
  for (const m of defaultMusic) {
    await db.insert(music)
      .values(m)
      .onConflictDoNothing()
  }

  console.log('Seeding mock analytics data...')

  // 6. Seed some mock users, weddings, orders, and transactions for the last 30 days
  const mockUsers = [
    { name: 'Budi Santoso', email: 'budi@example.com', role: 'USER', status: 'ACTIVE' },
    { name: 'Siti Aminah', email: 'siti@example.com', role: 'USER', status: 'ACTIVE' },
    { name: 'Rian Hidayat', email: 'rian@example.com', role: 'USER', status: 'ACTIVE' },
    { name: 'Dewi Lestari', email: 'dewi@example.com', role: 'USER', status: 'ACTIVE' },
    { name: 'Adit Pratama', email: 'adit@example.com', role: 'USER', status: 'ACTIVE' },
    { name: 'Lia Anggraini', email: 'lia@example.com', role: 'USER', status: 'PENDING' },
    { name: 'Rangga Wijaya', email: 'rangga@example.com', role: 'USER', status: 'BLOCKED' },
  ]

  const seededUsers: any[] = []
  for (const mu of mockUsers) {
    const passwordHash = bcrypt.hashSync('user123', 10)
    // Random created date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30)
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    const res = await db.insert(users)
      .values({
        name: mu.name,
        email: mu.email,
        passwordHash,
        role: mu.role,
        status: mu.status,
        createdAt,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: mu.name,
          role: mu.role,
          status: mu.status,
        }
      })
      .returning()
    seededUsers.push(res[0])
  }

  // Create active weddings for active users
  const activeUsers = seededUsers.filter(u => u.status === 'ACTIVE')
  
  // Seed Weddings, Orders, and Transactions
  for (let i = 0; i < activeUsers.length; i++) {
    const user = activeUsers[i]
    const themeId = i % 2 === 0 ? 'rustic' : 'elegant'
    const slug = `wedding-${user.name.toLowerCase().replace(/[^a-z]/g, '')}`
    const pkg = i % 2 === 0 ? basicPkg : premiumPkg
    
    // Create Wedding
    const expDays = pkg?.durationDays || 90
    // Make one wedding expire in 5 days for the "expire in 7 days" alert test
    const expiredAt = i === 0 
      ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) 
      : new Date(Date.now() + expDays * 24 * 60 * 60 * 1000)

    const wedRes = await db.insert(weddings)
      .values({
        userId: user.id,
        themeId,
        slug,
        status: 'published',
        expiredAt,
        data: {
          groom: { name: `${user.name.split(' ')[0]} Pria`, nickname: 'Groom', parents: 'Bpk & Ibu Pria' },
          bride: { name: 'Bride Wanita', nickname: 'Bride', parents: 'Bpk & Ibu Wanita' },
          schedule: {
            akad: { date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], venue: 'Gedung' },
            resepsi: { date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], venue: 'Gedung' },
          }
        }
      })
      .onConflictDoNothing()
      .returning()

    if (wedRes.length > 0) {
      const wId = wedRes[0].id
      // Seed some guests
      await db.insert(guests).values([
        { weddingId: wId, name: 'Tamu Satu', phone: '081234567890', uniqueToken: `t1-${wId.substring(0,6)}`, rsvpStatus: 'attending', message: 'Selamat ya!' },
        { weddingId: wId, name: 'Tamu Dua', phone: '081234567891', uniqueToken: `t2-${wId.substring(0,6)}`, rsvpStatus: 'declined', message: 'Maaf berhalangan hadir.' },
        { weddingId: wId, name: 'Tamu Tiga', phone: '081234567892', uniqueToken: `t3-${wId.substring(0,6)}`, rsvpStatus: 'pending' },
      ])
    }

    // Create Order
    const orderDaysAgo = Math.floor(Math.random() * 25)
    const orderDate = new Date(Date.now() - orderDaysAgo * 24 * 60 * 60 * 1000)
    const amount = pkg?.price || 150000

    const orderRes = await db.insert(orders)
      .values({
        userId: user.id,
        packageId: pkg?.id,
        status: 'PAID',
        amount,
        paymentMethod: 'QRIS',
        paidAt: orderDate,
        createdAt: orderDate,
      })
      .returning()

    if (orderRes.length > 0) {
      // Create Transaction
      await db.insert(transactions).values({
        orderId: orderRes[0].id,
        gatewayRef: `TRX-${Math.floor(Math.random() * 900000 + 100000)}`,
        status: 'success',
        payload: { simulated: true, method: 'QRIS' },
        createdAt: orderDate,
      })
    }
  }

  // Insert a pending order to populate pending analytics
  const pendingUser = seededUsers.find(u => u.status === 'PENDING')
  if (pendingUser && basicPkg) {
    const orderRes = await db.insert(orders)
      .values({
        userId: pendingUser.id,
        packageId: basicPkg.id,
        status: 'PENDING',
        amount: basicPkg.price,
        paymentMethod: 'TRANSFER_MANUAL',
        createdAt: new Date(),
      })
      .returning()

    if (orderRes.length > 0) {
      await db.insert(transactions).values({
        orderId: orderRes[0].id,
        gatewayRef: null,
        status: 'pending',
        payload: { method: 'TRANSFER_MANUAL' },
        createdAt: new Date(),
      })
    }
  }

  console.log('Seeding completed successfully!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
