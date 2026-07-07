import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import Navbar from '../../sections/landing/Navbar'
import Footer from '../../sections/landing/Footer'

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto">
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

        {/* Article Header */}
        <header className="mb-12 border-b border-sand pb-8">
          <div className="flex items-center gap-3 text-gold-600 mb-3">
            <Shield size={32} className="stroke-1" />
            <span className="text-xs uppercase tracking-widest font-semibold font-poppins">Privasi & Keamanan</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 tracking-wide text-charcoal">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-charcoal/60">Terakhir diperbarui: 12 Juni 2026</p>
        </header>

        {/* Content */}
        <article className="prose prose-stone max-w-none text-charcoal/80 leading-relaxed space-y-8 font-poppins text-sm">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p>
              Ngaturi mengumpulkan data yang Anda berikan secara sukarela untuk memproses pembuatan undangan pernikahan digital Anda. Data ini meliputi:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Data Akun:</strong> Nama lengkap, alamat email, kata sandi, dan nomor telepon/WhatsApp.
              </li>
              <li>
                <strong>Data Pernikahan:</strong> Detail pengantin pria & wanita, tanggal & lokasi akad/resepsi, kutipan pernikahan, serta unggahan foto galeri.
              </li>
              <li>
                <strong>Data RSVP Tamu:</strong> Nama tamu, ucapan selamat, status kehadiran, serta token akses tamu untuk undangan personal.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              2. Penggunaan Data Anda
            </h2>
            <p>Kami menggunakan data yang dikumpulkan untuk tujuan berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menampilkan undangan digital secara publik sesuai dengan slug yang Anda buat.</li>
              <li>Memproses transaksi pembayaran paket layanan melalui gerbang pembayaran (Tripay/Midtrans).</li>
              <li>Mengirimkan email verifikasi, kwitansi, instruksi bayar, dan notifikasi kedaluwarsa masa aktif undangan.</li>
              <li>Menyediakan statistik RSVP dan check-in tamu pada Dasboard pengguna.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              3. Keamanan Informasi Anda
            </h2>
            <p>
              Kami sangat mengutamakan keamanan data Anda. Kami menerapkan standar pengamanan teknis terbaik untuk mencegah akses tidak sah, pengubahan, pengungkapan, atau penghancuran data Anda. Ini meliputi pengamanan lalu lintas data dengan enkripsi SSL/TLS, proteksi database, verifikasi token JWT, serta validasi unggahan media yang ketat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              4. Berbagi Informasi dengan Pihak Ketiga
            </h2>
            <p>
              Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak lain. Kami hanya membagikan data kepada pihak ketiga yang tepercaya demi kelancaran operasional platform kami, seperti penyedia Payment Gateway (Tripay) untuk memproses pembayaran dan layanan SMTP Email (Resend) untuk pengiriman email transaksi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              5. Hak dan Pilihan Anda
            </h2>
            <p>
              Sebagai pengguna, Anda berhak untuk mengakses, mengubah, memperbarui, atau menghapus data pribadi dan data pernikahan Anda kapan saja langsung melalui Dasboard akun Anda. Jika Anda ingin menutup akun secara permanen, Anda dapat menghubungi tim support kami melalui kontak resmi yang tersedia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              6. Hubungi Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi tim kami di{' '}
              <a href="mailto:support@ngaturi.id" className="text-gold-600 underline">
                support@ngaturi.id
              </a>{' '}
              atau melalui WhatsApp Customer Service kami.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy
