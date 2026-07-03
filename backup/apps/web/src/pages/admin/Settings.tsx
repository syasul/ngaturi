import React, { useEffect, useState } from 'react'
import {
  Mail,
  CreditCard,
  Cloud,
  Bell,
  AlertOctagon,
  Save,
  Send,
  Loader2,
} from 'lucide-react'
import api from '../../lib/api'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'

interface SystemSettingsData {
  smtp?: {
    host: string
    port: string
    user: string
    pass: string
    from: string
  }
  tripay?: {
    apiKey: string
    privateKey: string
    merchantCode: string
    isSandbox: boolean
  }
  midtrans?: {
    clientKey: string
    serverKey: string
    isProduction: boolean
  }
  storage?: {
    endpoint: string
    accessKeyId: string
    secretAccessKey: string
    bucket: string
  }
  telegram?: {
    enabled: boolean
    botToken: string
    chatId: string
  }
  maintenance?: {
    enabled: boolean
    message: string
  }
}

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData>({
    smtp: { host: '', port: '587', user: '', pass: '', from: '' },
    tripay: { apiKey: '', privateKey: '', merchantCode: '', isSandbox: true },
    midtrans: { clientKey: '', serverKey: '', isProduction: false },
    storage: { endpoint: '', accessKeyId: '', secretAccessKey: '', bucket: '' },
    telegram: { enabled: false, botToken: '', chatId: '' },
    maintenance: { enabled: false, message: '' },
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'smtp' | 'tripay' | 'midtrans' | 'storage' | 'telegram' | 'maintenance'>('smtp')

  // Test email state
  const [testEmail, setTestEmail] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings')
        if (response.data.settings) {
          // Merge defaults with returned keys to prevent undefined inputs
          setSettings({
            smtp: {
              host: response.data.settings.smtp?.host || '',
              port: String(response.data.settings.smtp?.port || '587'),
              user: response.data.settings.smtp?.user || '',
              pass: response.data.settings.smtp?.pass || '',
              from: response.data.settings.smtp?.from || '',
            },
            tripay: {
              apiKey: response.data.settings.tripay?.apiKey || '',
              privateKey: response.data.settings.tripay?.privateKey || '',
              merchantCode: response.data.settings.tripay?.merchantCode || '',
              isSandbox: response.data.settings.tripay?.isSandbox !== false,
            },
            midtrans: {
              clientKey: response.data.settings.midtrans?.clientKey || '',
              serverKey: response.data.settings.midtrans?.serverKey || '',
              isProduction: !!response.data.settings.midtrans?.isProduction,
            },
            storage: {
              endpoint: response.data.settings.storage?.endpoint || '',
              accessKeyId: response.data.settings.storage?.accessKeyId || '',
              secretAccessKey: response.data.settings.storage?.secretAccessKey || '',
              bucket: response.data.settings.storage?.bucket || '',
            },
            telegram: {
              enabled: !!response.data.settings.telegram?.enabled,
              botToken: response.data.settings.telegram?.botToken || '',
              chatId: response.data.settings.telegram?.chatId || '',
            },
            maintenance: {
              enabled: !!response.data.settings.maintenance?.enabled,
              message: response.data.settings.maintenance?.message || 'Kami sedang melakukan pemeliharaan rutin. Silakan kembali lagi beberapa saat lagi.',
            },
          })
        }
      } catch (err: any) {
        toast.error('Gagal memuat konfigurasi sistem.')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  // Handle Input Changes
  const handleSmtpChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      smtp: { ...prev.smtp!, [field]: value },
    }))
  }

  const handleTripayChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      tripay: { ...prev.tripay!, [field]: value },
    }))
  }

  const handleMidtransChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      midtrans: { ...prev.midtrans!, [field]: value },
    }))
  }

  const handleStorageChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      storage: { ...prev.storage!, [field]: value },
    }))
  }

  const handleTelegramChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      telegram: { ...prev.telegram!, [field]: value },
    }))
  }

  const handleMaintenanceChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      maintenance: { ...prev.maintenance!, [field]: value },
    }))
  }

  // Save Config
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', settings)
      toast.success('Konfigurasi sistem berhasil disimpan!')
    } catch (err: any) {
      toast.error('Gagal menyimpan konfigurasi.')
    } finally {
      setSaving(false)
    }
  }

  // Test Email
  const handleTestEmail = async () => {
    if (!testEmail || !settings.smtp?.host) {
      toast.error('Masukkan alamat email dan pastikan host SMTP terisi.')
      return
    }
    setSendingTest(true)
    try {
      const response = await api.post('/admin/settings/test-email', {
        smtp: settings.smtp,
        testEmail,
      })
      toast.success(response.data.message || 'Test email berhasil dikirim!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengirim email uji coba.')
    } finally {
      setSendingTest(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    )
  }

  const tabs = [
    { id: 'smtp', label: 'SMTP Email', icon: Mail },
    { id: 'tripay', label: 'Tripay Gateway', icon: CreditCard },
    { id: 'midtrans', label: 'Midtrans Gateway', icon: CreditCard },
    { id: 'storage', label: 'Cloud Storage', icon: Cloud },
    { id: 'telegram', label: 'Notifikasi Bot', icon: Bell },
    { id: 'maintenance', label: 'Maintenance', icon: AlertOctagon },
  ] as const

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-400">Kelola API key, kredensial SMTP, dan parameter sistem Ngaturi</p>
      </div>

      {/* Layout Tabs */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Form Content */}
        <div className="flex-1 w-full bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl relative">
          <form onSubmit={handleSave} className="space-y-6">
            {/* SMTP TAB */}
            {activeTab === 'smtp' && settings.smtp && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Konfigurasi SMTP Mail Server</h3>
                  <p className="text-xs text-slate-500">Konfigurasi server email untuk OTP dan tagihan lunas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={settings.smtp.host}
                      onChange={(e) => handleSmtpChange('host', e.target.value)}
                      placeholder="e.g. smtp.mailgun.org or smtp.gmail.com"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      value={settings.smtp.port}
                      onChange={(e) => handleSmtpChange('port', e.target.value)}
                      placeholder="e.g. 587 or 465"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={settings.smtp.user}
                      onChange={(e) => handleSmtpChange('user', e.target.value)}
                      placeholder="e.g. postmaster@yourdomain.com"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={settings.smtp.pass}
                      onChange={(e) => handleSmtpChange('pass', e.target.value)}
                      placeholder="••••••••"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Sender Email (From)
                    </label>
                    <input
                      type="text"
                      value={settings.smtp.from}
                      onChange={(e) => handleSmtpChange('from', e.target.value)}
                      placeholder="e.g. Ngaturi <noreply@ngaturi.id>"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Email tester widget */}
                <div className="border-t border-slate-800 pt-6 mt-6 bg-slate-950/40 p-5 rounded-2xl border border-slate-850">
                  <h4 className="text-xs font-semibold text-slate-350 mb-1">Kirim Email Uji Coba (Tester)</h4>
                  <p className="text-[10px] text-slate-500 mb-3">
                    Uji konfigurasi SMTP di atas dengan mengirim email tes ke alamat pribadi.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Masukkan email penerima..."
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      disabled={sendingTest}
                      onClick={handleTestEmail}
                      className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                    >
                      {sendingTest ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
                      <span>Uji Kirim</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TRIPAY TAB */}
            {activeTab === 'tripay' && settings.tripay && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Payment Gateway (Tripay)</h3>
                  <p className="text-xs text-slate-500">Integrasi merchant payment gateway otomatis (direkomendasikan untuk startup Indonesia)</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={settings.tripay.apiKey}
                      onChange={(e) => handleTripayChange('apiKey', e.target.value)}
                      placeholder="DEV-..."
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Private Key
                    </label>
                    <input
                      type="password"
                      value={settings.tripay.privateKey}
                      onChange={(e) => handleTripayChange('privateKey', e.target.value)}
                      placeholder="••••••••"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Kode Merchant
                    </label>
                    <input
                      type="text"
                      value={settings.tripay.merchantCode}
                      onChange={(e) => handleTripayChange('merchantCode', e.target.value)}
                      placeholder="e.g. T1234"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <div>
                      <span className="block text-xs font-semibold text-slate-350">Sandbox Mode (Uji Coba)</span>
                      <span className="block text-[10px] text-slate-500">Aktifkan untuk integrasi simulator Tripay Sandbox</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTripayChange('isSandbox', !settings.tripay!.isSandbox)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        settings.tripay.isSandbox ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                          settings.tripay.isSandbox ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4">
                    <span className="block text-xs font-semibold text-slate-350">Webhook Callback URL</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Konfigurasikan callback URL berikut pada panel merchant Tripay Anda:
                    </span>
                    <div className="mt-2 p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono text-amber-500 select-all">
                      {window.location.origin.replace(':5173', ':4000')}/api/webhook/payment
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MIDTRANS TAB */}
            {activeTab === 'midtrans' && settings.midtrans && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Payment Gateway (Midtrans)</h3>
                  <p className="text-xs text-slate-500">Integrasi pembayaran tagihan invoice otomatis</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Client Key
                    </label>
                    <input
                      type="text"
                      value={settings.midtrans.clientKey}
                      onChange={(e) => handleMidtransChange('clientKey', e.target.value)}
                      placeholder="SB-Mid-client-..."
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Server Key
                    </label>
                    <input
                      type="password"
                      value={settings.midtrans.serverKey}
                      onChange={(e) => handleMidtransChange('serverKey', e.target.value)}
                      placeholder="SB-Mid-server-..."
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <div>
                      <span className="block text-xs font-semibold text-slate-350">Production Mode</span>
                      <span className="block text-[10px] text-slate-500">Aktifkan untuk menerima transaksi riil/asli</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMidtransChange('isProduction', !settings.midtrans!.isProduction)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        settings.midtrans.isProduction ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                          settings.midtrans.isProduction ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STORAGE TAB */}
            {activeTab === 'storage' && settings.storage && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Object Cloud Storage (S3 / R2)</h3>
                  <p className="text-xs text-slate-500">Konfigurasi penyimpanan file foto pengantin dan MP3</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={settings.storage.endpoint}
                      onChange={(e) => handleStorageChange('endpoint', e.target.value)}
                      placeholder="e.g. https://your-account-id.r2.cloudflarestorage.com"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                        Access Key ID
                      </label>
                      <input
                        type="text"
                        value={settings.storage.accessKeyId}
                        onChange={(e) => handleStorageChange('accessKeyId', e.target.value)}
                        placeholder="Access Key..."
                        className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                        Secret Access Key
                      </label>
                      <input
                        type="password"
                        value={settings.storage.secretAccessKey}
                        onChange={(e) => handleStorageChange('secretAccessKey', e.target.value)}
                        placeholder="Secret Key..."
                        className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Nama Bucket
                    </label>
                    <input
                      type="text"
                      value={settings.storage.bucket}
                      onChange={(e) => handleStorageChange('bucket', e.target.value)}
                      placeholder="e.g. ngaturi-uploads"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TELEGRAM TAB */}
            {activeTab === 'telegram' && settings.telegram && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Notifikasi Bot (Telegram)</h3>
                  <p className="text-xs text-slate-500">Kirim notifikasi transaksi/order masuk langsung ke channel admin</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-slate-350">Aktifkan Notifikasi Telegram</span>
                      <span className="block text-[10px] text-slate-500">Kirim pesan setiap ada order baru lunas</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTelegramChange('enabled', !settings.telegram!.enabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        settings.telegram.enabled ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                          settings.telegram.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Telegram Bot Token
                    </label>
                    <input
                      type="password"
                      value={settings.telegram.botToken}
                      onChange={(e) => handleTelegramChange('botToken', e.target.value)}
                      placeholder="e.g. 123456:ABC-def..."
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Chat ID Penerima (Personal / Channel)
                    </label>
                    <input
                      type="text"
                      value={settings.telegram.chatId}
                      onChange={(e) => handleTelegramChange('chatId', e.target.value)}
                      placeholder="e.g. -100123456789 or 987654321"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MAINTENANCE TAB */}
            {activeTab === 'maintenance' && settings.maintenance && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Mode Pemeliharaan (Maintenance Mode)</h3>
                  <p className="text-xs text-slate-500">Kunci seluruh akses platform untuk publik sementara waktu</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-slate-350">Aktifkan Maintenance Mode</span>
                      <span className="block text-[10px] text-slate-500">Tampilkan halaman kunci pemeliharaan</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaintenanceChange('enabled', !settings.maintenance!.enabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        settings.maintenance.enabled ? 'bg-rose-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                          settings.maintenance.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Pesan Pemeliharaan
                    </label>
                    <textarea
                      value={settings.maintenance.message}
                      onChange={(e) => handleMaintenanceChange('message', e.target.value)}
                      rows={4}
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-poppins"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t border-slate-800 pt-6 mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                <span>Simpan Konfigurasi</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
