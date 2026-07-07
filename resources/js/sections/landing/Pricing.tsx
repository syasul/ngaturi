import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import React, { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import TiltCard from '../../components/ui/TiltCard';

export const Pricing: React.FC = () => {
    const [showMatrix, setShowMatrix] = useState(false);

    const packages: {
        name: string;
        price: string;
        description: string;
        features: string[];
        isPopular: boolean;
        cta: string;
        accent: 'primary' | 'secondary' | 'outline' | 'ghost';
    }[] = [
        {
            name: 'Starter',
            price: 'Rp 99.000',
            description: 'Cocok untuk pernikahan intim dan sederhana.',
            features: [
                'Masa aktif 3 bulan',
                'Pilih 1 tema basic',
                'Galeri maks 5 foto',
                'RSVP & Ucapan online',
                'Integrasi Google Maps',
                'Backsound musik standar',
                'Maks 100 nama tamu unik',
            ],
            isPopular: false,
            cta: 'Pilih Starter',
            accent: 'outline',
        },
        {
            name: 'Premium',
            price: 'Rp 199.000',
            description: 'Paket paling laris dengan fitur lengkap.',
            features: [
                'Masa aktif 1 tahun',
                'Bebas ganti semua tema premium',
                'Galeri foto & video unlimited',
                'RSVP & Ucapan online real-time',
                'Integrasi Google Maps',
                'Backsound musik custom (MP3/Link)',
                'Unlimited nama tamu unik',
                'Buku Tamu Digital (QR Code)',
                'Protokol kesehatan & angpao digital',
            ],
            isPopular: true,
            cta: 'Pilih Premium',
            accent: 'primary',
        },
        {
            name: 'Custom / WO',
            price: 'Hubungi Kami',
            description: 'Layanan eksklusif untuk WO & pernikahan besar.',
            features: [
                'Masa aktif selamanya',
                'Desain kustom eksklusif sesuai request',
                'Domain kustom (.com / .id / .wedding)',
                'Layanan input data dibantu tim admin',
                'Support prioritas 24/7 WhatsApp',
                'White label (tanpa watermark Ngaturi)',
                'Custom integrasi buku tamu fisik',
            ],
            isPopular: false,
            cta: 'Hubungi Sales',
            accent: 'secondary',
        },
    ];

    const comparisonMatrix = [
        {
            feature: 'Masa Aktif',
            starter: '3 Bulan',
            premium: '1 Tahun',
            custom: 'Selamanya',
        },
        {
            feature: 'Pilihan Tema',
            starter: '1 Tema Basic',
            premium: 'Semua Tema',
            custom: 'Desain Kustom',
        },
        {
            feature: 'Jumlah Foto',
            starter: 'Maks 5 Foto',
            premium: 'Unlimited',
            custom: 'Unlimited',
        },
        {
            feature: 'Nama Tamu Unik',
            starter: 'Maks 100',
            premium: 'Unlimited',
            custom: 'Unlimited',
        },
        {
            feature: 'RSVP & Ucapan',
            starter: true,
            premium: true,
            custom: true,
        },
        {
            feature: 'Backsound Musik',
            starter: 'Standar',
            premium: 'Custom MP3/Link',
            custom: 'Custom MP3/Link',
        },
        {
            feature: 'Buku Tamu (QR Code)',
            starter: false,
            premium: true,
            custom: true,
        },
        {
            feature: 'Angpao Digital & Kado',
            starter: false,
            premium: true,
            custom: true,
        },
        {
            feature: 'Hapus Watermark',
            starter: false,
            premium: false,
            custom: true,
        },
        {
            feature: 'Custom Domain',
            starter: false,
            premium: false,
            custom: true,
        },
    ];

    return (
        <section id="pricing" className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6 text-center">
                {/* Section Header */}
                <div className="mb-16">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                        Paket Investasi
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Investasi Sekali, Kenangan Selamanya
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                </div>

                {/* Pricing Cards Grid */}
                <div className="mb-16 grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
                    {packages.map((pkg, i) => (
                        <TiltCard key={i} className="flex h-full w-full">
                            <Card
                                hoverable={false}
                                className={`relative flex w-full flex-col justify-between rounded-3xl bg-white p-8 ${
                                    pkg.isPopular
                                        ? 'border-2 border-gold-500 shadow-lg'
                                        : 'border border-gray-100'
                                }`}
                            >
                                {pkg.isPopular && (
                                    <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                                        <Badge
                                            variant="gold"
                                            className="shadow-xs px-4 py-1 font-bold"
                                        >
                                            ⭐ Terpopuler
                                        </Badge>
                                    </div>
                                )}

                                <div className="mb-8 text-left">
                                    <h3 className="mb-2 font-poppins text-xl font-bold text-charcoal">
                                        {pkg.name}
                                    </h3>
                                    <p className="mb-6 font-sans text-xs leading-relaxed text-charcoal/50">
                                        {pkg.description}
                                    </p>
                                    <div className="flex items-baseline text-charcoal">
                                        <span className="font-poppins text-2xl font-extrabold tracking-tight sm:text-3xl">
                                            {pkg.price}
                                        </span>
                                        {pkg.price !== 'Hubungi Kami' && (
                                            <span className="ml-1 font-sans text-xs text-charcoal/50">
                                                /sekali bayar
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="flex flex-1 flex-col justify-between">
                                    <ul className="mb-8 flex flex-col gap-3 text-left font-sans text-sm text-charcoal/70">
                                        {pkg.features.map((feat, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-2.5"
                                            >
                                                <Check
                                                    size={16}
                                                    className="mt-0.5 shrink-0 text-gold-500"
                                                />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        variant={pkg.accent}
                                        size="md"
                                        className="w-full font-poppins font-semibold"
                                    >
                                        {pkg.cta}
                                    </Button>
                                </div>
                            </Card>
                        </TiltCard>
                    ))}
                </div>

                {/* Feature Comparison Matrix Toggle */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => setShowMatrix(!showMatrix)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-charcoal/10 px-6 py-3 font-poppins text-sm font-semibold text-charcoal/80 transition-all hover:border-gold-300 hover:text-gold-600"
                    >
                        <span>
                            {showMatrix
                                ? 'Sembunyikan Perbandingan'
                                : 'Lihat Perbandingan Lengkap'}
                        </span>
                        {showMatrix ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>

                    <AnimatePresence>
                        {showMatrix && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    duration: 0.4,
                                    ease: 'easeInOut',
                                }}
                                className="shadow-xs mt-8 w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-100"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse bg-white text-left font-sans text-xs text-charcoal sm:text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-cream/40 font-poppins font-semibold">
                                                <th className="p-4 sm:p-5">
                                                    Fitur Lengkap
                                                </th>
                                                <th className="p-4 text-center sm:p-5">
                                                    Starter
                                                </th>
                                                <th className="p-4 text-center font-bold text-gold-600 sm:p-5">
                                                    Premium
                                                </th>
                                                <th className="p-4 text-center sm:p-5">
                                                    Custom
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonMatrix.map(
                                                (row, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-gray-50 transition-colors hover:bg-cream/10"
                                                    >
                                                        <td className="p-4 font-medium sm:p-5">
                                                            {row.feature}
                                                        </td>

                                                        {/* Starter cell */}
                                                        <td className="p-4 text-center text-charcoal/70 sm:p-5">
                                                            {typeof row.starter ===
                                                            'boolean' ? (
                                                                row.starter ? (
                                                                    <Check
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mx-auto text-gold-500"
                                                                    />
                                                                ) : (
                                                                    <X
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mx-auto text-red-400"
                                                                    />
                                                                )
                                                            ) : (
                                                                row.starter
                                                            )}
                                                        </td>

                                                        {/* Premium cell */}
                                                        <td className="bg-gold-50/10 p-4 text-center font-semibold text-gold-600 sm:p-5">
                                                            {typeof row.premium ===
                                                            'boolean' ? (
                                                                row.premium ? (
                                                                    <Check
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mx-auto text-gold-500"
                                                                    />
                                                                ) : (
                                                                    <X
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mx-auto text-red-400"
                                                                    />
                                                                )
                                                            ) : (
                                                                row.premium
                                                            )}
                                                        </td>

                                                        {/* Custom cell */}
                                                        <td className="p-4 text-center text-charcoal/70 sm:p-5">
                                                            {typeof row.custom ===
                                                            'boolean' ? (
                                                                row.custom ? (
                                                                    <Check
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mx-auto text-gold-500"
                                                                    />
                                                                ) : (
                                                                    <X
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mx-auto text-red-400"
                                                                    />
                                                                )
                                                            ) : (
                                                                row.custom
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
