import nodemailer from 'nodemailer'
import env from './config'
import { db, eq, systemSettings } from '../db'

// Initialize static fallback transporter if SMTP variables are configured
const isSmtpConfigured = !!(
  env.SMTP_HOST &&
  env.SMTP_PORT &&
  env.SMTP_USER &&
  env.SMTP_PASS
)

let transporter: nodemailer.Transporter | null = null

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  })
}

// Get dynamic SMTP transporter from database settings, or static fallback
export async function getTransporter(): Promise<nodemailer.Transporter | null> {
  try {
    const settingRow = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, 'smtp')
    })
    if (settingRow && settingRow.value) {
      const smtp = settingRow.value as any
      if (smtp.host && smtp.port && smtp.user && smtp.pass) {
        return nodemailer.createTransport({
          host: smtp.host,
          port: Number(smtp.port),
          secure: Number(smtp.port) === 465,
          auth: {
            user: smtp.user,
            pass: smtp.pass,
          },
        })
      }
    }
  } catch (err) {
    console.error('Error getting dynamic SMTP transporter:', err)
  }
  return transporter
}

// Get sender email from settings or environment fallback
export async function getSenderEmail(): Promise<string> {
  try {
    const settingRow = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, 'smtp')
    })
    if (settingRow && settingRow.value) {
      const smtp = settingRow.value as any
      if (smtp.from) {
        return smtp.from
      }
    }
  } catch (err) {}
  return env.SMTP_FROM || '"Ngaturi" <noreply@ngaturi.id>'
}

// Premium Branded Layout Wrapper
function wrapBrandedTemplate(title: string, contentHtml: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2cca6; border-radius: 12px; background-color: #faf7f2; color: #2c2c2c; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #a9803b; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 300;">NGATURI</h1>
        <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #8b6914;">Premium Digital Invitation</p>
      </div>
      <div style="width: 100%; height: 1px; background: linear-gradient(to right, transparent, #e2cca6, transparent); margin-bottom: 30px;"></div>
      
      <div style="line-height: 1.6; font-size: 14px;">
        ${contentHtml}
      </div>
      
      <div style="width: 100%; height: 1px; background: linear-gradient(to right, transparent, #e2cca6, transparent); margin: 30px 0 20px 0;"></div>
      <div style="text-align: center; font-size: 11px; color: #a9803b; font-weight: 500; opacity: 0.6;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Ngaturi.id. All rights reserved.</p>
        <p style="margin: 5px 0 0 0; color: #999;">Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
      </div>
    </div>
  `
}

export async function sendVerificationOTP(email: string, name: string, otp: string) {
  const subject = 'Verifikasi Email — Ngaturi'
  const htmlContent = wrapBrandedTemplate(
    subject,
    `
      <h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Verifikasi Akun Anda</h3>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Terima kasih telah bergabung di Ngaturi. Silakan gunakan kode OTP di bawah ini untuk memverifikasi alamat email Anda:</p>
      <div style="text-align: center; margin: 35px 0;">
        <span style="font-family: Monaco, Consolas, monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #8b6914; background-color: #f5ede3; padding: 12px 30px; border-radius: 8px; border: 1px dashed #d4956a; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="color: #666; font-size: 13px; line-height: 1.5;">Kode verifikasi ini berlaku selama <strong>10 menit</strong>. Mohon jangan bagikan kode ini kepada siapa pun.</p>
    `
  )

  const activeTransporter = await getTransporter()
  const fromEmail = await getSenderEmail()

  if (activeTransporter) {
    await activeTransporter.sendMail({
      from: fromEmail,
      to: email,
      subject,
      html: htmlContent,
    })
  } else {
    // Elegant fallback logger for development
    console.log(`
┌────────────────────────────────────────────────────────┐
│               📧 OUTGOING EMAIL (DEV MODE)             │
├────────────────────────────────────────────────────────┤
│ Subject : ${subject}
│ To      : ${email} (${name})
│ OTP     : ${otp}
│ Expire  : 10 Minutes
├────────────────────────────────────────────────────────┤
│ Silakan gunakan kode OTP di atas untuk verifikasi.     │
└────────────────────────────────────────────────────────┘
`)
  }
}

export async function sendPasswordReset(email: string, name: string, resetLink: string) {
  const subject = 'Atur Ulang Kata Sandi — Ngaturi'
  const htmlContent = wrapBrandedTemplate(
    subject,
    `
      <h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Atur Ulang Kata Sandi</h3>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda di Ngaturi. Silakan klik tombol di bawah ini untuk melanjutkan:</p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetLink}" style="background-color: #a9803b; color: white; padding: 12px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(169, 128, 59, 0.2); font-size: 14px; letter-spacing: 0.5px;">
          Atur Ulang Kata Sandi
        </a>
      </div>
      <p style="word-break: break-all; font-size: 12px; color: #777; text-align: center; margin: 20px 0;">
        Atau salin tautan berikut ke browser Anda:<br/>
        <a href="${resetLink}" style="color: #8b6914; text-decoration: underline;">${resetLink}</a>
      </p>
      <p style="color: #666; font-size: 13px; line-height: 1.5;">Tautan reset ini berlaku selama <strong>1 jam</strong> dan hanya dapat digunakan satu kali. Jika Anda tidak meminta hal ini, abaikan email ini.</p>
    `
  )

  const activeTransporter = await getTransporter()
  const fromEmail = await getSenderEmail()

  if (activeTransporter) {
    await activeTransporter.sendMail({
      from: fromEmail,
      to: email,
      subject,
      html: htmlContent,
    })
  } else {
    // Elegant fallback logger for development
    console.log(`
┌────────────────────────────────────────────────────────┐
│               📧 OUTGOING EMAIL (DEV MODE)             │
├────────────────────────────────────────────────────────┤
│ Subject : ${subject}
│ To      : ${email} (${name})
│ Link    : ${resetLink}
│ Expire  : 1 Hour
├────────────────────────────────────────────────────────┤
│ Silakan salin tautan di atas untuk mereset kata sandi.  │
└────────────────────────────────────────────────────────┘
`)
  }
}

export async function sendPaymentReceipt(
  email: string,
  name: string,
  invoiceId: string,
  amount: number,
  packageName: string,
  paymentMethod: string
) {
  const subject = `Kwitansi Pembayaran #${invoiceId} — Ngaturi`
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
  
  const htmlContent = wrapBrandedTemplate(
    subject,
    `
      <h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Pembayaran Berhasil Diterima</h3>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Pembayaran Anda untuk Invoice <strong>#${invoiceId}</strong> telah berhasil kami terima. Berikut adalah rincian transaksi Anda:</p>
      
      <div style="background-color: #f5ede3; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2cca6;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Invoice ID</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">#${invoiceId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Paket Layanan</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">${packageName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Metode Pembayaran</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="color: #666; padding: 12px 0 0 0; font-size: 15px;">Total Bayar</td>
            <td style="font-weight: bold; text-align: right; color: #a9803b; padding: 12px 0 0 0; font-size: 18px;">${formattedAmount}</td>
          </tr>
        </table>
      </div>
      
      <p>Layanan undangan digital Anda telah diaktifkan / diperpanjang secara otomatis. Silakan masuk ke dashboard untuk mengelola undangan Anda.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background-color: #a9803b; color: white; padding: 12px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 14px;">
          Ke Dashboard Undangan
        </a>
      </div>
    `
  )

  const activeTransporter = await getTransporter()
  const fromEmail = await getSenderEmail()

  if (activeTransporter) {
    await activeTransporter.sendMail({
      from: fromEmail,
      to: email,
      subject,
      html: htmlContent,
    })
  } else {
    console.log(`
┌────────────────────────────────────────────────────────┐
│               📧 OUTGOING RECEIPT (DEV MODE)           │
├────────────────────────────────────────────────────────┤
│ Subject : ${subject}
│ To      : ${email} (${name})
│ Invoice : ${invoiceId}
│ Package : ${packageName}
│ Amount  : ${formattedAmount}
│ Method  : ${paymentMethod}
├────────────────────────────────────────────────────────┤
│ Pembayaran berhasil disimulasikan & diaktifkan.        │
└────────────────────────────────────────────────────────┘
`)
  }
}

export async function sendOrderCreated(
  email: string,
  name: string,
  orderId: string,
  amount: number,
  packageName: string,
  paymentMethod: string,
  paymentCode: string,
  qrUrl?: string
) {
  const subject = `Instruksi Pembayaran Order #${orderId.substring(0, 8).toUpperCase()} — Ngaturi`
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

  let paymentDetailsHtml = ''
  if (qrUrl) {
    paymentDetailsHtml = `
      <div style="text-align: center; margin: 20px 0;">
        <p style="margin-bottom: 10px; color: #666; font-size: 13px;">Silakan scan QR Code berikut untuk membayar:</p>
        <img src="${qrUrl}" alt="QR Code" style="border: 2px solid #e2cca6; border-radius: 8px; padding: 5px; background: white; max-width: 200px;" />
      </div>
    `
  } else {
    paymentDetailsHtml = `
      <div style="text-align: center; margin: 25px 0; background-color: #f5ede3; padding: 15px; border-radius: 8px; border: 1px solid #e2cca6;">
        <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Nomor Virtual Account / Kode Bayar</p>
        <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #8b6914;">${paymentCode}</span>
      </div>
    `
  }

  const htmlContent = wrapBrandedTemplate(
    subject,
    `
      <h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Tagihan Pembayaran Baru</h3>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Order Anda untuk paket <strong>${packageName}</strong> telah berhasil dibuat. Selesaikan pembayaran sebelum batas waktu untuk mengaktifkan undangan Anda.</p>
      
      <div style="background-color: #f5ede3; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2cca6;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Order ID</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">#${orderId.substring(0, 8).toUpperCase()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Metode Pembayaran</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="color: #666; padding: 8px 0;">Total Tagihan</td>
            <td style="font-weight: bold; text-align: right; color: #a9803b; padding: 8px 0; font-size: 16px;">${formattedAmount}</td>
          </tr>
        </table>
        
        ${paymentDetailsHtml}
      </div>

      <h4 style="color: #8b6914; margin-bottom: 10px; font-weight: 600;">Petunjuk Pembayaran:</h4>
      <ol style="padding-left: 20px; margin: 0 0 20px 0; font-size: 13px; color: #555; line-height: 1.6;">
        <li>Buka aplikasi Mobile Banking / E-Wallet Anda.</li>
        <li>Pilih menu Transfer ke Virtual Account (atau scan QRIS).</li>
        <li>Masukkan Kode Bayar / Scan QR Code di atas.</li>
        <li>Pastikan nominal transfer tepat sebesar <strong>${formattedAmount}</strong>.</li>
        <li>Konfirmasi transaksi Anda. Pembayaran akan terverifikasi otomatis dalam 1-5 menit.</li>
      </ol>

      <p style="color: #c92a2a; font-size: 13px; font-weight: 600; text-align: center; margin-top: 15px;">Batas waktu pembayaran adalah 24 jam semenjak transaksi dibuat.</p>
    `
  )

  const activeTransporter = await getTransporter()
  const fromEmail = await getSenderEmail()

  if (activeTransporter) {
    await activeTransporter.sendMail({
      from: fromEmail,
      to: email,
      subject,
      html: htmlContent,
    })
  } else {
    console.log(`
┌────────────────────────────────────────────────────────┐
│             📧 OUTGOING ORDER CREATED (DEV)            │
├────────────────────────────────────────────────────────┤
│ Subject : ${subject}
│ To      : ${email} (${name})
│ Order   : ${orderId}
│ Method  : ${paymentMethod}
│ Code    : ${paymentCode}
│ Amount  : ${formattedAmount}
└────────────────────────────────────────────────────────┘
`)
  }
}

export async function sendAdminOrderNotification(
  adminEmail: string,
  orderId: string,
  amount: number,
  packageName: string,
  customerName: string,
  customerEmail: string
) {
  const subject = `[Admin Alert] Order Baru Masuk #${orderId.substring(0, 8).toUpperCase()}`
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

  const htmlContent = wrapBrandedTemplate(
    subject,
    `
      <h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Notifikasi Transaksi Baru</h3>
      <p>Halo Admin,</p>
      <p>Sebuah order baru dengan status <strong>PENDING</strong> telah didaftarkan ke sistem:</p>
      
      <div style="background-color: #f5ede3; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2cca6;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Order ID</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">#${orderId.substring(0, 8).toUpperCase()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Pelanggan</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">${customerName} (${customerEmail})</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2cca6;">
            <td style="color: #666; padding: 8px 0;">Paket</td>
            <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">${packageName}</td>
          </tr>
          <tr>
            <td style="color: #666; padding: 8px 0;">Nominal</td>
            <td style="font-weight: bold; text-align: right; color: #a9803b; padding: 8px 0; font-size: 16px;">${formattedAmount}</td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 13px; color: #666;">Transaksi ini sedang menunggu konfirmasi pembayaran otomatis via gateway Tripay.</p>
    `
  )

  const activeTransporter = await getTransporter()
  const fromEmail = await getSenderEmail()

  if (activeTransporter) {
    await activeTransporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject,
      html: htmlContent,
    })
  } else {
    console.log(`
┌────────────────────────────────────────────────────────┐
│             📧 OUTGOING ADMIN ALERT (DEV)              │
├────────────────────────────────────────────────────────┤
│ Subject : ${subject}
│ Admin   : ${adminEmail}
│ Customer: ${customerName} (${customerEmail})
│ Package : ${packageName}
│ Amount  : ${formattedAmount}
└────────────────────────────────────────────────────────┘
`)
  }
}

export async function sendExpirationWarning(
  email: string,
  name: string,
  weddingTitle: string,
  expireDateStr: string
) {
  const subject = `⚠️ Masa Aktif Undangan "${weddingTitle}" Segera Habis — Ngaturi`
  
  const htmlContent = wrapBrandedTemplate(
    subject,
    `
      <h3 style="color: #c92a2a; margin-top: 0; font-weight: 600;">Peringatan Masa Aktif Undangan</h3>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Undangan pernikahan digital Anda yang berjudul <strong>"${weddingTitle}"</strong> akan segera habis masa aktifnya dalam waktu <strong>7 hari</strong> lagi, tepatnya pada:</p>
      
      <div style="text-align: center; margin: 25px 0; background-color: #fff0f0; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
        <span style="font-size: 18px; font-weight: bold; color: #c92a2a;">${expireDateStr}</span>
      </div>

      <p>Setelah tanggal tersebut, undangan Anda tidak akan bisa diakses oleh para tamu undangan secara publik (draf/expired mode).</p>
      <p>Untuk memperpanjang masa aktif, silakan masuk ke dashboard Anda dan lakukan transaksi perpanjangan paket.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/billing" style="background-color: #c92a2a; color: white; padding: 12px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 8px rgba(201, 42, 42, 0.2);">
          Perpanjang Sekarang
        </a>
      </div>
      <p style="color: #666; font-size: 13px;">Abaikan email ini jika Anda memang ingin menonaktifkan undangan pernikahan Anda setelah acara selesai.</p>
    `
  )

  const activeTransporter = await getTransporter()
  const fromEmail = await getSenderEmail()

  if (activeTransporter) {
    await activeTransporter.sendMail({
      from: fromEmail,
      to: email,
      subject,
      html: htmlContent,
    })
  } else {
    console.log(`
┌────────────────────────────────────────────────────────┐
│             📧 OUTGOING EXPIRY WARNING (DEV)           │
├────────────────────────────────────────────────────────┤
│ Subject : ${subject}
│ To      : ${email} (${name})
│ Wedding : ${weddingTitle}
│ Expiry  : ${expireDateStr}
└────────────────────────────────────────────────────────┘
`)
  }
}
