import { motion } from 'framer-motion';
import { LayoutDashboard, PenTool, Send, Sparkles } from 'lucide-react';
import React from 'react';

export const Solution: React.FC = () => {
    const solutions = [
        {
            icon: <PenTool className="h-6 w-6 text-gold-500" />,
            title: 'Buat & Kustomisasi Instan',
            desc: 'Isi formulir detail acara, pilih musik, upload galeri foto, dan sesuaikan tema sesuka hati hanya dalam 10 menit.',
        },
        {
            icon: <Send className="h-6 w-6 text-gold-500" />,
            title: 'Sebar Cepat & Personalisasi',
            desc: 'Tulis nama tamu secara otomatis di tiap link undangan. Sebar dengan mudah via WhatsApp, Telegram, atau Email.',
        },
        {
            icon: <LayoutDashboard className="h-6 w-6 text-gold-500" />,
            title: 'Dashboard RSVP Terintegrasi',
            desc: 'Pantau kehadiran tamu secara real-time, baca ucapan doa, serta kelola QR code Check-In kehadiran tamu di lokasi.',
        },
    ];

    return (
        <section id="solution" className="overflow-hidden bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left: Solution lists */}
                    <div className="flex flex-col justify-center lg:col-span-5">
                        <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                            Solusi Kami
                        </span>
                        <h2 className="mb-6 mt-2 font-display text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
                            Satu Platform, Semua Kebutuhan Beres
                        </h2>
                        <p className="mb-10 font-sans leading-relaxed text-charcoal/70">
                            Tinggalkan cetak undangan fisik yang mahal dan
                            repot. Kelola seluruh persiapan sebaran undangan
                            hingga buku tamu digital secara autopilot.
                        </p>

                        <div className="flex flex-col gap-8">
                            {solutions.map((sol, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.15,
                                    }}
                                    key={i}
                                    className="flex items-start gap-4"
                                >
                                    <div className="shrink-0 rounded-xl border border-gold-100 bg-gold-50 p-3">
                                        {sol.icon}
                                    </div>
                                    <div>
                                        <h3 className="mb-1.5 font-poppins text-base font-semibold text-charcoal sm:text-lg">
                                            {sol.title}
                                        </h3>
                                        <p className="font-sans text-sm leading-relaxed text-charcoal/60">
                                            {sol.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Mockups */}
                    <div className="relative flex items-center justify-center py-8 lg:col-span-7">
                        <div className="absolute left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-100/30 blur-2xl" />

                        {/* Laptop Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 aspect-[16/10] w-full max-w-[500px] overflow-hidden rounded-xl border border-charcoal/80 bg-charcoal shadow-xl"
                        >
                            <div className="flex h-6 items-center gap-1.5 border-b border-charcoal/10 bg-charcoal/90 px-3">
                                <span className="h-2 w-2 rounded-full bg-red-400" />
                                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                                <span className="h-2 w-2 rounded-full bg-green-400" />
                                <span className="ml-4 truncate font-mono text-[10px] text-gray-500">
                                    dashboard.ngaturi.id/wedding-reno-kirana
                                </span>
                            </div>
                            <div className="flex h-full bg-gray-50 font-sans text-xs">
                                <div className="flex w-1/4 flex-col gap-2 border-r border-gray-200 bg-charcoal p-2 text-gray-400">
                                    <div className="rounded-xs mb-4 h-4 bg-gray-700/50" />
                                    <div className="rounded-xs flex h-3 items-center gap-1 bg-gold-500/20 px-1.5 py-0.5 font-medium text-gold-500">
                                        📊 Dashboard
                                    </div>
                                    <div className="rounded-xs h-3 bg-transparent px-1.5 py-0.5">
                                        👥 Data Tamu
                                    </div>
                                    <div className="rounded-xs h-3 bg-transparent px-1.5 py-0.5">
                                        🎨 Desain Tema
                                    </div>
                                    <div className="rounded-xs h-3 bg-transparent px-1.5 py-0.5">
                                        🎵 Musik
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-charcoal">
                                            Undangan Reno &amp; Kirana
                                        </span>
                                        <span className="rounded-sm bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-600">
                                            AKTIF
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="shadow-2xs rounded-sm border border-gray-100 bg-white p-2">
                                            <span className="block text-[8px] text-gray-400">
                                                Tamu Diundang
                                            </span>
                                            <span className="text-sm font-bold text-charcoal">
                                                1,250
                                            </span>
                                        </div>
                                        <div className="shadow-2xs rounded-sm border border-gray-100 bg-white p-2">
                                            <span className="block text-[8px] text-gray-400">
                                                RSVP Hadir
                                            </span>
                                            <span className="text-sm font-bold text-emerald-600">
                                                842
                                            </span>
                                        </div>
                                        <div className="shadow-2xs rounded-sm border border-gray-100 bg-white p-2">
                                            <span className="block text-[8px] text-gray-400">
                                                Total Ucapan
                                            </span>
                                            <span className="text-sm font-bold text-gold-600">
                                                312
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between rounded-sm border border-gray-100 bg-white p-2">
                                        <span className="text-[8px] font-semibold text-gray-400">
                                            Statistik Kehadiran
                                        </span>
                                        <div className="flex h-16 items-end justify-center gap-2.5 pt-2">
                                            <div className="rounded-t-xs h-[30%] w-6 bg-gold-200" />
                                            <div className="rounded-t-xs h-[55%] w-6 bg-gold-300" />
                                            <div className="rounded-t-xs h-[85%] w-6 bg-gold-500" />
                                            <div className="rounded-t-xs h-[45%] w-6 bg-rustic-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mobile Phone Mockup */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, rotate: 5 }}
                            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.25 }}
                            className="absolute bottom-[-20px] right-2 z-20 aspect-[9/18] w-36 overflow-hidden rounded-2xl border border-charcoal/80 bg-charcoal p-1.5 shadow-2xl sm:right-6 sm:w-44 lg:right-10"
                        >
                            <div className="absolute left-1/2 top-2 z-30 flex h-3 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-charcoal">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                            </div>
                            <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-xl border border-sand bg-[#fdfcf9] px-3 py-6">
                                <img
                                    src="/assets/wedding/hero-floral.png"
                                    alt=""
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12]"
                                />
                                <div className="relative z-10 mt-3 text-center">
                                    <span className="font-handwriting text-sm text-gold-500">
                                        The Wedding of
                                    </span>
                                    <h4 className="mt-1 font-sans text-sm font-bold text-charcoal">
                                        Reno &amp; Kirana
                                    </h4>
                                </div>
                                <div className="relative z-10 flex h-16 w-16 items-center justify-center">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-gold-500/10" />
                                    <div className="relative rounded-full bg-gold-500/20 p-2 text-gold-600">
                                        <Sparkles size={16} />
                                    </div>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <span className="font-poppins text-[7px] font-semibold uppercase tracking-widest text-charcoal/60">
                                        Kepada Yth:
                                    </span>
                                    <span className="rounded-sm border border-gold-200 bg-gold-50 px-2 py-0.5 text-[8px] font-bold text-charcoal">
                                        Bapak Arya Mulya
                                    </span>
                                    <button className="shadow-xs mt-1 rounded-full bg-gold-500 px-3.5 py-1 font-poppins text-[8px] font-medium text-white transition-colors hover:bg-gold-600">
                                        Buka Undangan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Solution;
