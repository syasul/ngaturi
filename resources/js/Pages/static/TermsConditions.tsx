import { ArrowLeft, Scale } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../sections/landing/Footer';
import Navbar from '../../sections/landing/Navbar';

export const TermsConditions: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col justify-between bg-cream font-sans text-charcoal">
            <Navbar />

            <main className="mx-auto max-w-4xl flex-grow px-6 pb-20 pt-32">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-gold-600 transition-colors hover:text-gold-700"
                    >
                        <ArrowLeft size={16} />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                {/* Article Header */}
                <header className="mb-12 border-b border-sand pb-8">
                    <div className="mb-3 flex items-center gap-3 text-gold-600">
                        <Scale size={32} className="stroke-1" />
                        <span className="font-poppins text-xs font-semibold uppercase tracking-widest">
                            Aturan Layanan
                        </span>
                    </div>
                    <h1 className="mb-4 font-sans text-4xl font-bold tracking-wide text-charcoal sm:text-5xl">
                        Syarat & Ketentuan
                    </h1>
                    <p className="text-sm text-charcoal/60">
                        Terakhir diperbarui: 12 Juni 2026
                    </p>
                </header>

                {/* Content */}
                <article className="prose prose-stone max-w-none space-y-8 font-poppins text-sm leading-relaxed text-charcoal/80">
                    <section className="space-y-3">
                        <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                            1. Penerimaan Ketentuan
                        </h2>
                        <p>
                            Dengan mendaftar, mengakses, atau menggunakan
                            platform Ngaturi.id, Anda menyetujui untuk terikat
                            oleh seluruh Syarat & Ketentuan ini. Jika Anda tidak
                            menyetujui salah satu bagian dari aturan ini, Anda
                            tidak diperkenankan menggunakan layanan kami.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                            2. Ketentuan Akun Pengguna
                        </h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                Anda harus memberikan data pendaftaran yang
                                akurat, lengkap, dan terbaru.
                            </li>
                            <li>
                                Anda bertanggung jawab penuh untuk menjaga
                                kerahasiaan kata sandi akun Anda.
                            </li>
                            <li>
                                Satu akun dipergunakan untuk pembuatan undangan
                                sesuai paket yang dibeli. Penyalahgunaan akun
                                secara massal untuk spamming atau eksploitasi
                                sistem akan menyebabkan pemblokiran instan tanpa
                                refund.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                            3. Paket Layanan & Masa Aktif
                        </h2>
                        <p>
                            Masa aktif undangan bervariasi bergantung pada jenis
                            paket yang Anda pilih saat checkout. Setelah masa
                            aktif habis (biasanya setelah acara pernikahan
                            selesai), status undangan akan berubah menjadi
                            draf/arsip non-aktif sehingga tidak dapat diakses
                            publik. Anda dapat memperpanjang masa aktif tersebut
                            dengan melakukan transaksi pembelian paket
                            perpanjangan di halaman Billing Dasboard Anda.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                            4. Kebijakan Konten
                        </h2>
                        <p>
                            Pengguna bertanggung jawab penuh atas segala konten
                            (foto, biodata, teks, lagu latar belakang) yang
                            diunggah ke dalam undangan. Ngaturi melarang keras
                            penggunaan konten yang melanggar hak cipta pihak
                            lain, mengandung unsur pornografi, judi, sara, atau
                            melanggar hukum Negara Kesatuan Republik Indonesia.
                            Kami berhak menghapus konten ilegal secara sepihak
                            dan memblokir akun pelanggar.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                            5. Kebijakan Pengembalian Dana (Refund)
                        </h2>
                        <p>
                            Seluruh pembelian paket bersifat final. Karena kami
                            menyediakan simulator preview dan masa aktif gratis
                            draf secara lengkap sebelum Anda melakukan checkout
                            pembayaran, pengembalian dana (refund) tidak dapat
                            diproses kecuali terjadi kegagalan sistem
                            pengaktifan transaksi dari payment gateway kami yang
                            tidak dapat diselesaikan dalam 3x24 jam kerja.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                            6. Batasan Tanggung Jawab
                        </h2>
                        <p>
                            Ngaturi berupaya menjaga uptime layanan hingga
                            99.9%. Namun, kami tidak bertanggung jawab atas
                            kerugian moril atau materiil yang timbul akibat
                            gangguan jaringan, serangan siber, kegagalan
                            penyedia server pihak ketiga (hosting/DNS), atau
                            keadaan kahar (force majeure) yang berada di luar
                            kendali teknis langsung kami.
                        </p>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default TermsConditions;
