import { motion } from 'framer-motion';
import { FormInput, ImageUp, SendHorizonal, UserPlus } from 'lucide-react';
import React from 'react';

export const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <UserPlus className="h-6 w-6 text-gold-500" />,
            step: '01',
            title: 'Daftar & Pilih Paket',
            desc: 'Buat akun dalam hitungan detik dan tentukan paket fitur sesuai kebutuhan pernikahanmu.',
        },
        {
            icon: <FormInput className="h-6 w-6 text-gold-500" />,
            step: '02',
            title: 'Isi Data & Pilih Tema',
            desc: 'Lengkapi formulir informasi pengantin, detail acara, serta pilih desain tema favorit.',
        },
        {
            icon: <ImageUp className="h-6 w-6 text-gold-500" />,
            step: '03',
            title: 'Upload Foto & Musik',
            desc: 'Unggah galeri foto pre-wedding, video pertunangan, dan pilih alunan lagu romantis pengiring.',
        },
        {
            icon: <SendHorizonal className="h-6 w-6 text-gold-500" />,
            step: '04',
            title: 'Publish & Sebar',
            desc: 'Undangan aktif seketika. Salin link personalisasi tamu dan bagikan ke seluruh daftar kontak.',
        },
    ];

    return (
        <section
            id="how-it-works"
            className="relative overflow-hidden bg-cream/20 py-24"
        >
            <div className="absolute left-0 top-1/2 z-0 h-64 w-64 -translate-y-1/2 rounded-full bg-gold-200/10 blur-2xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
                <div className="mb-20">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                        Langkah Mudah
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Bagaimana Cara Kerjanya?
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                </div>

                <div className="relative flex flex-col items-stretch justify-between gap-8 lg:flex-row">
                    <div className="absolute left-[10%] right-[10%] top-[44px] z-0 hidden h-[1.5px] border-t border-dashed border-gold-300/60 lg:block" />
                    {steps.map((item, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            key={i}
                            className="shadow-xs relative z-10 flex flex-1 flex-col items-center rounded-2xl border border-gray-100/80 bg-white p-6 text-center transition-all duration-300 hover:border-gold-300"
                        >
                            <div className="absolute right-6 top-4 select-none font-mono font-poppins text-3xl font-bold text-gold-400/30">
                                {item.step}
                            </div>
                            <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-sand bg-cream">
                                <div className="absolute inset-0.5 rounded-full border border-sand/40 bg-white" />
                                <div className="relative z-10">{item.icon}</div>
                            </div>
                            <h3 className="mb-3 font-poppins text-base font-bold text-charcoal sm:text-lg">
                                {item.title}
                            </h3>
                            <p className="max-w-[240px] font-sans text-xs leading-relaxed text-charcoal/60 sm:text-sm">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
