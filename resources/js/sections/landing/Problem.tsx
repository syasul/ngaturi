import { motion } from 'framer-motion';
import { Clock, FileWarning, Landmark, Leaf } from 'lucide-react';
import React from 'react';
import Card from '../../components/ui/Card';

export const Problem: React.FC = () => {
    const problems = [
        {
            icon: <Landmark className="h-8 w-8 text-red-600" />,
            title: 'Biaya Cetak Selangit',
            desc: 'Cetak fisik mahal, wajib minimal order ratusan lembar, belum termasuk ongkir ke luar kota.',
        },
        {
            icon: <Clock className="h-8 w-8 text-amber-600" />,
            title: 'Buang Waktu & Energi',
            desc: 'Menulis alamat, menempel label, dan mengirimkan pesan WhatsApp satu-per-satu memakan waktu berhari-hari.',
        },
        {
            icon: <FileWarning className="h-8 w-8 text-orange-600" />,
            title: 'Salah Tulis & Cetak Ulang',
            desc: 'Ada typo nama tamu atau jadwal berubah? Undangan fisik terlanjur tercetak terpaksa dibuang.',
        },
        {
            icon: <Leaf className="h-8 w-8 text-emerald-600" />,
            title: 'Kurang Ramah Lingkungan',
            desc: 'Kertas sisa undangan fisik akan menjadi tumpukan sampah setelah acara selesai.',
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 80 },
        },
    };

    return (
        <section id="problem" className="relative bg-cream/30 pb-32 pt-24">
            {/* Decorative ornament watermark */}
            <img
                src="/assets/wedding/ornaments.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 w-48 rotate-90 select-none opacity-[0.06]"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
                <div className="mb-16">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-rustic-600">
                        Tantangan & Masalah
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Masih Pakai Cara Lama?
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4"
                >
                    {problems.map((prob, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{
                                rotate: [0, -2, 2, -2, 2, 0],
                                transition: { duration: 0.35 },
                            }}
                        >
                            <Card className="flex h-full flex-col items-start bg-white p-8 hover:border-red-200">
                                <div className="mb-6 rounded-xl bg-cream p-3">
                                    {prob.icon}
                                </div>
                                <h3 className="mb-3 font-poppins text-lg font-semibold text-charcoal">
                                    {prob.title}
                                </h3>
                                <p className="font-sans text-sm leading-relaxed text-charcoal/70">
                                    {prob.desc}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Original wave SVG */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 w-full select-none overflow-hidden leading-none">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block h-[60px] w-full fill-current text-white"
                >
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
                </svg>
            </div>
        </section>
    );
};

export default Problem;
