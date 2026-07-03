import crypto from 'crypto'
import { db, eq, systemSettings } from '../db'

export interface TripayConfig {
  apiKey: string
  privateKey: string
  merchantCode: string
  isSandbox: boolean
}

export interface CreateTransactionParams {
  method: string
  merchantRef: string
  amount: number
  customerName: string
  customerEmail: string
  packageName: string
}

export interface TripayInstruction {
  title: string
  steps: string[]
}

export interface TripayTransactionResponse {
  reference: string
  merchant_ref: string
  payment_name: string
  payment_method: string
  payment_code: string
  qr_url?: string
  qr_string?: string
  amount: number
  pay_code?: string
  pay_url?: string
  checkout_url?: string
  status: 'UNPAID' | 'PAID' | 'FAILED' | 'EXPIRED'
  expired_time: number
  instructions: TripayInstruction[]
}

// Fetch Tripay settings from DB
export async function getTripayConfig(): Promise<TripayConfig | null> {
  try {
    const settingRow = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, 'tripay'),
    })

    if (!settingRow || !settingRow.value) return null

    const config = settingRow.value as any
    if (config.apiKey && config.privateKey && config.merchantCode) {
      return {
        apiKey: config.apiKey,
        privateKey: config.privateKey,
        merchantCode: config.merchantCode,
        isSandbox: config.isSandbox !== false,
      }
    }
  } catch (error) {
    console.error('Error fetching Tripay settings:', error)
  }
  return null
}

// Request closed transaction from Tripay, or simulate if unconfigured
export async function createTripayTransaction(
  params: CreateTransactionParams
): Promise<TripayTransactionResponse> {
  const config = await getTripayConfig()

  // MOCK SIMULATION MODE (when credentials are not yet entered)
  if (!config) {
    console.log('Tripay not configured. Simulating payment gateway transaction...')
    const isQris = params.method === 'QRIS'
    const expiredTime = Math.floor(Date.now() / 1000) + 24 * 3600
    const mockRef = 'TRX-' + Math.random().toString(36).substring(2, 11).toUpperCase()
    
    return {
      reference: mockRef,
      merchant_ref: params.merchantRef,
      payment_name: isQris ? 'QRIS (Simulasi)' : `${params.method} Virtual Account (Simulasi)`,
      payment_method: params.method,
      payment_code: isQris ? 'NgaturiSimulatedQRIS' : '88301' + Math.floor(10000000 + Math.random() * 90000000),
      qr_url: isQris 
        ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=NgaturiPayment-${params.merchantRef}`
        : undefined,
      amount: params.amount,
      status: 'UNPAID',
      expired_time: expiredTime,
      instructions: [
        {
          title: 'Cara Pembayaran via ATM',
          steps: [
            'Masukkan kartu ATM dan PIN Anda.',
            'Pilih menu Transaksi Lainnya > Transfer > Ke Rekening Virtual Account.',
            `Masukkan Kode Bayar: ${isQris ? 'Scan QR Code' : 'Nomor VA di atas'}.`,
            `Pastikan nominal transfer sama dengan ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(params.amount)}.`,
            'Ikuti instruksi selanjutnya untuk menyelesaikan transaksi.'
          ]
        },
        {
          title: 'Cara Pembayaran via M-Banking',
          steps: [
            'Buka aplikasi Mobile Banking Anda.',
            'Pilih menu Transfer > Virtual Account.',
            `Input Nomor Virtual Account / Kode Bayar.`,
            'Periksa detail tagihan, lalu konfirmasi pembayaran.',
            'Masukkan PIN M-Banking Anda.'
          ]
        }
      ]
    }
  }

  // REAL INTEGRATION MODE
  const { apiKey, privateKey, merchantCode, isSandbox } = config
  const baseUrl = isSandbox 
    ? 'https://tripay.co.id/api-sandbox/transaction/create'
    : 'https://tripay.co.id/api/transaction/create'

  // Generate Request Signature
  const signature = crypto
    .createHmac('sha256', privateKey)
    .update(merchantCode + params.merchantRef + params.amount)
    .digest('hex')

  const callbackUrl = process.env.API_URL 
    ? `${process.env.API_URL}/api/webhook/payment` 
    : 'http://localhost:4000/api/webhook/payment'

  const body = {
    method: params.method,
    merchant_ref: params.merchantRef,
    amount: params.amount,
    customer_name: params.customerName,
    customer_email: params.customerEmail,
    order_items: [
      {
        name: params.packageName,
        price: params.amount,
        quantity: 1,
      },
    ],
    callback_url: callbackUrl,
    expired_time: Math.floor(Date.now() / 1000) + 24 * 3600,
    signature: signature,
  }

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Gagal membuat transaksi di Tripay.')
    }

    return result.data as TripayTransactionResponse;
  } catch (error: any) {
    console.error('Tripay Request Failure:', error)
    throw new Error(error.message || 'Gagal menghubungi server Tripay.')
  }
}
