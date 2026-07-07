import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Scale } from 'lucide-react'
import Navbar from '../../sections/landing/Navbar'
import Footer from '../../sections/landing/Footer'

export const TermsConditions: React.FC = () => {
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
            <Scale size={32} className="stroke-1" />
            <span className="text-xs uppercase tracking-widest font-semibold font-poppins">Aturan Layanan</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 tracking-wide text-charcoal">
            Syarat & Ketentuan
          </h1>
          <p className="text-sm text-charcoal/60">Terakhir diperbarui: 12 Juni 2026</p>
        </header>

        {/* Content */}
        <article className="prose prose-stone max-w-none text-charcoal/80 leading-relaxed space-y-8 font-poppins text-sm">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              1. Penerimaan Ketentuan
            </h2>
            <p>
              Dengan mendaftar, mengakses, atau menggunakan platform Ngaturi.id, Anda menyetujui untuk terikat oleh seluruh Syarat & Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari aturan ini, Anda tidak diperkenankan menggunakan layanan kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              2. Ketentuan Akun Pengguna
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anda harus memberikan data pendaftaran yang akurat, lengkap, dan terbaru.</li>
              <li>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi akun Anda.</li>
              <li>Satu akun dipergunakan untuk pembuatan undangan sesuai paket yang dibeli. Penyalahgunaan akun secara massal untuk spamming atau eksploitasi sistem akan menyebabkan pemblokiran instan tanpa refund.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              3. Paket Layanan & Masa Aktif
            </h2>
            <p>
              Masa aktif undangan bervariasi bergantung pada jenis paket yang Anda pilih saat checkout. Setelah masa aktif habis (biasanya setelah acara pernikahan selesai), status undangan akan berubah menjadi draf/arsip non-aktif sehingga tidak dapat diakses publik. Anda dapat memperpanjang masa aktif tersebut dengan melakukan transaksi pembelian paket perpanjangan di halaman Billing Dasboard Anda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              4. Kebijakan Konten
            </h2>
            <p>
              Pengguna bertanggung jawab penuh atas segala konten (foto, biodata, teks, lagu latar belakang) yang diunggah ke dalam undangan. Ngaturi melarang keras penggunaan konten yang melanggar hak cipta pihak lain, mengandung unsur pornografi, judi, sara, atau melanggar hukum Negara Kesatuan Republik Indonesia. Kami berhak menghapus konten ilegal secara sepihak dan memblokir akun pelanggar.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              5. Kebijakan Pengembalian Dana (Refund)
            </h2>
            <p>
              Seluruh pembelian paket bersifat final. Karena kami menyediakan simulator preview dan masa aktif gratis draf secara lengkap sebelum Anda melakukan checkout pembayaran, pengembalian dana (refund) tidak dapat diproses kecuali terjadi kegagalan sistem pengaktifan transaksi dari payment gateway kami yang tidak dapat diselesaikan dalam 3x24 jam kerja.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
              6. Batasan Tanggung Jawab
            </h2>
            <p>
              Ngaturi berupaya menjaga uptime layanan hingga 99.9%. Namun, kami tidak bertanggung jawab atas kerugian moril atau materiil yang timbul akibat gangguan jaringan, serangan siber, kegagalan penyedia server pihak ketiga (hosting/DNS), atau keadaan kahar (force majeure) yang berada di luar kendali teknis langsung kami.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default TermsConditions
