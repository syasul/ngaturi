import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '../../sections/landing/Navbar'
import Footer from '../../sections/landing/Footer'
import Button from '../../components/ui/Button'

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Pertanyaan Umum',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Mohon lengkapi semua kolom formulir.')
      return
    }

    setIsLoading(true)
    // Simulate sending message
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Pesan Anda berhasil dikirim! Tim support kami akan segera membalas email Anda.')
      setFormData({
        name: '',
        email: '',
        subject: 'Pertanyaan Umum',
        message: '',
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="mb-12 border-b border-sand pb-8">
          <div className="flex items-center gap-3 text-gold-600 mb-3">
            <MessageSquare size={32} className="stroke-1" />
            <span className="text-xs uppercase tracking-widest font-semibold font-poppins">Bantuan Layanan</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 tracking-wide text-charcoal">
            Hubungi Kami
          </h1>
          <p className="text-sm text-charcoal/60">Kami di sini untuk membantu memperlancar perayaan hari bahagia Anda.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Form Column */}
          <section className="md:col-span-7 bg-white/60 backdrop-blur-xs border border-sand p-8 rounded-2xl shadow-xs">
            <h2 className="font-serif text-2xl font-semibold mb-6 text-charcoal">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2 font-poppins">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full bg-cream/50 border border-sand focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-4 py-3 text-sm transition-all outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2 font-poppins">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contoh@domain.com"
                  className="w-full bg-cream/50 border border-sand focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-4 py-3 text-sm transition-all outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2 font-poppins">
                  Subjek Pertanyaan
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-cream/50 border border-sand focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-4 py-3 text-sm transition-all outline-none"
                  disabled={isLoading}
                >
                  <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                  <option value="Kendala Teknis">Kendala Teknis / Bug</option>
                  <option value="Layanan Pembayaran & Billing">Layanan Pembayaran & Billing</option>
                  <option value="Kerja Sama / Afiliasi">Kerja Sama / Afiliasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2 font-poppins">
                  Pesan Anda
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  placeholder="Tuliskan pesan atau kendala Anda di sini..."
                  className="w-full bg-cream/50 border border-sand focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-4 py-3 text-sm transition-all outline-none resize-none"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 flex items-center justify-center gap-2 cursor-pointer font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={16} />
                )}
                <span>{isLoading ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </Button>
            </form>
          </section>

          {/* Contact Details Column */}
          <section className="md:col-span-5 space-y-6">
            {/* Quick WhatsApp Support Card */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Phone size={24} className="stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-charcoal">WhatsApp Support</h3>
                <p className="text-xs text-charcoal/60 px-4">
                  Respon lebih cepat via obrolan WhatsApp Customer Service untuk bantuan edit tema, kustomisasi, atau masalah aktivasi paket.
                </p>
              </div>
              <a
                href="https://wa.me/6281330012100"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white border-none py-3.5 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.335 4.978L2 22l5.177-1.356a9.948 9.948 0 004.832 1.25c5.506 0 9.989-4.478 9.99-9.984A10.002 10.002 0 0012.012 2zm5.723 14.108c-.297.836-1.42 1.527-2.317 1.714-.614.127-1.42.226-4.095-.877-3.42-1.408-5.617-4.887-5.787-5.114-.17-.227-1.357-1.801-1.357-3.437 0-1.637.85-2.443 1.152-2.784.303-.341.66-.426.88-.426.22 0 .44.004.63.012.193.008.454-.074.71.545.263.633.9 2.195.979 2.355.078.16.13.348.026.56-.104.21-.158.34-.316.52-.158.182-.332.408-.475.547-.158.156-.324.326-.14.64.184.316.817 1.347 1.751 2.179.94.832 1.73 1.09 1.977 1.214.247.125.39.102.536-.065.145-.168.627-.728.795-.975.168-.247.337-.206.568-.12.23.086 1.458.687 1.71.813.253.125.42.188.483.293.063.104.063.606-.233 1.442z"/></svg>
                  <span>Chat WhatsApp CS</span>
                </Button>
              </a>
            </div>

            {/* Email Support Card */}
            <div className="border border-sand p-6 rounded-2xl space-y-3 bg-white/40">
              <h3 className="font-serif text-lg font-bold text-charcoal">Kantor Operasional</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                PT Ngaturi Autopilot Pernikahan<br />
                Gedung Premium Creative Hub Lt. 4<br />
                Jl. Jenderal Sudirman No. 102, Jakarta Selatan, Indonesia<br />
                Email: support@ngaturi.id
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
