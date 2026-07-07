import { motion } from 'framer-motion';
import { Image, Link, MailCheck, Map, Music, QrCode } from 'lucide-react';
import React from 'react';
import Card from '../../components/ui/Card';

export const Features: React.FC = () => {
    const features = [
        {
            icon: <MailCheck className="h-7 w-7 text-gold-600" />,
            title: 'RSVP Otomatis',
            desc: 'Tamu melakukan konfirmasi kehadiran secara online and datanya langsung tercatat di dashboard.',
        },
        {
            icon: <Map className="h-7 w-7 text-gold-600" />,
            title: 'Integrasi Google Maps',
            desc: 'Peta penunjuk lokasi akad dan resepsi yang akurat, membantu tamu menemukan rute terbaik.',
        },
        {
            icon: <Image className="h-7 w-7 text-gold-600" />,
            title: 'Galeri Foto & Video',
            desc: 'Tampilkan kolase foto pre-wedding dan video momen bahagia kalian berdua dengan transisi elegan.',
        },
        {
            icon: <Music className="h-7 w-7 text-gold-600" />,
            title: 'Backsound Musik',
            desc: 'Sambut kunjungan tamu undangan dengan alunan lagu romantis pilihan yang dapat diaktifkan otomatis.',
        },
        {
            icon: <Link className="h-7 w-7 text-gold-600" />,
            title: 'Link Unik per Tamu',
            desc: 'Kirim link personalisasi sehingga nama masing-masing tamu secara eksklusif muncul di undangan.',
        },
        {
            icon: <QrCode className="h-7 w-7 text-gold-600" />,
            title: 'QR Code Kehadiran',
            desc: 'Gunakan scan QR code di lokasi resepsi untuk check-in kehadiran tamu secara praktis dan modern.',
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 100 },
        },
    };

    return (
        <section
            id="features"
            className="relative overflow-hidden bg-white py-24"
        >
            <img
                src="/assets/wedding/ornaments.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-0 w-44 -rotate-90 select-none opacity-[0.05]"
            />

            <div className="mx-auto max-w-7xl px-6 text-center">
                <div className="mb-16">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                        Fitur Unggulan
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Semua yang Kamu Butuhkan, Sudah Ada
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 gap-8 text-left md:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feat, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="flex h-full items-start gap-5 border-gray-100 bg-cream/15 p-8 hover:border-gold-200 hover:bg-white">
                                <div className="shadow-xs shrink-0 rounded-2xl border border-sand bg-white p-3">
                                    {feat.icon}
                                </div>
                                <div>
                                    <h3 className="mb-2 font-poppins text-base font-bold text-charcoal sm:text-lg">
                                        {feat.title}
                                    </h3>
                                    <p className="font-sans text-sm leading-relaxed text-charcoal/65">
                                        {feat.desc}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
