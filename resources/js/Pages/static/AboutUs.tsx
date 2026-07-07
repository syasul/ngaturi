import { ArrowLeft, Compass, Heart, Leaf, Sparkles } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../sections/landing/Footer';
import Navbar from '../../sections/landing/Navbar';

export const AboutUs: React.FC = () => {
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
                <header className="mb-12 border-b border-sand pb-8 text-center sm:text-left">
                    <div className="mb-3 flex items-center justify-center gap-3 text-gold-600 sm:justify-start">
                        <Compass size={32} className="stroke-1" />
                        <span className="font-poppins text-xs font-semibold uppercase tracking-widest">
                            Misi & Cerita Kami
                        </span>
                    </div>
                    <h1 className="mb-4 font-sans text-4xl font-bold tracking-wide text-charcoal sm:text-5xl">
                        Tentang Kami
                    </h1>
                    <p className="text-sm text-charcoal/60">
                        Mewujudkan Undangan Pernikahan Digital Editorial Terbaik
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-12 font-poppins text-sm leading-relaxed text-charcoal/80">
                    {/* Section: Who We Are */}
                    <section className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
                        <div className="space-y-4">
                            <h2 className="font-sans text-2xl font-bold text-charcoal">
                                Seni dalam Setiap Undangan
                            </h2>
                            <p>
                                Didirikan pada tahun 2026,{' '}
                                <strong>Ngaturi</strong> lahir dari kegelisahan
                                melihat mahalnya biaya cetak undangan kertas
                                konvensional dan dampak sampahnya bagi
                                lingkungan sekitar. Kami percaya bahwa transisi
                                ke era digital tidak boleh menghilangkan rasa
                                sakral, sopan santun, dan estetika premium dari
                                sebuah kabar bahagia pernikahan.
                            </p>
                            <p>
                                Nama <strong>"Ngaturi"</strong> berasal dari
                                bahasa Jawa Kuno yang berarti *mengundang* atau
                                *mempersembahkan secara santun*. Melalui
                                filosofi ini, kami mendesain platform undangan
                                pernikahan digital berasas premium editorial,
                                memberikan kenyamanan berkarya bagi pasangan
                                calon mempelai.
                            </p>
                        </div>
                        <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-2xl border border-sand bg-sand/30 p-8 text-center">
                            <Sparkles
                                size={40}
                                className="stroke-1 text-gold-600"
                            />
                            <p className="font-sans text-lg italic text-charcoal">
                                "Menyampaikan kabar suci dengan kemewahan
                                digital tanpa merusak kelestarian bumi."
                            </p>
                        </div>
                    </section>

                    {/* Section: Core Values */}
                    <section className="space-y-6 border-t border-sand pt-8">
                        <h2 className="text-center font-sans text-2xl font-bold text-charcoal">
                            Tiga Pilar Utama Kami
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-3 rounded-xl border border-sand bg-white/50 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                                    <Leaf size={20} />
                                </div>
                                <h3 className="font-sans text-lg font-semibold text-charcoal">
                                    Eco-Friendly
                                </h3>
                                <p className="text-xs text-charcoal/70">
                                    Mengurangi konsumsi kertas cetak dan limbah
                                    karbon transportasi kurir pos untuk masa
                                    depan bumi yang hijau.
                                </p>
                            </div>

                            <div className="space-y-3 rounded-xl border border-sand bg-white/50 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                                    <Sparkles size={20} />
                                </div>
                                <h3 className="font-sans text-lg font-semibold text-charcoal">
                                    High Aesthetics
                                </h3>
                                <p className="text-xs text-charcoal/70">
                                    Tema premium yang dirancang khusus oleh
                                    desainer profesional demi menjaga kesakralan
                                    momentum suci pernikahan Anda.
                                </p>
                            </div>

                            <div className="space-y-3 rounded-xl border border-sand bg-white/50 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                                    <Heart size={20} />
                                </div>
                                <h3 className="font-sans text-lg font-semibold text-charcoal">
                                    Zero Hassle
                                </h3>
                                <p className="text-xs text-charcoal/70">
                                    Fitur otomasi RSVP, navigasi maps, album
                                    musik latar, hingga sistem check-in tamu
                                    undangan terintegrasi.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Commitment */}
                    <section className="mx-auto max-w-2xl space-y-4 border-t border-sand pt-8 text-center">
                        <h2 className="font-sans text-2xl font-bold text-charcoal">
                            Komitmen Kami
                        </h2>
                        <p>
                            Kami terus melakukan inovasi secara konsisten demi
                            memberikan performa web tercepat dan fitur
                            termutakhir untuk menemani rangkaian hari bahagia
                            pernikahan Anda. Terima kasih telah mempercayakan
                            perayaan kebahagiaan suci Anda kepada Ngaturi.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
