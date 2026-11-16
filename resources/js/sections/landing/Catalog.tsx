import { Link } from '@inertiajs/react';
import { ArrowRight, ExternalLink, Eye, Smartphone, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import TiltCard from '../../components/ui/TiltCard';
import { LANDING_SAMPLE_THEMES, type CatalogTheme } from '../../data/themesData';

export const Catalog: React.FC = () => {
    const [selectedTheme, setSelectedTheme] = useState<CatalogTheme | null>(null);

    return (
        <section
            id="catalog"
            className="relative overflow-hidden bg-cream/20 py-24"
        >
            {/* Subtle floral watermark */}
            <img
                src="/assets/wedding/hero-floral.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.05]"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
                {/* Section Header */}
                <div className="mb-14">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                        Inspirasi Desain
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Pilihan Tema Favorit Mempelai
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                    <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-charcoal/70 sm:text-base">
                        Berikut beberapa contoh tema populer yang memikat hati. Masing-masing dilengkapi
                        fitur interaktif modern, musik latar, hitung mundur, dan responsif di semua perangkat.
                    </p>
                </div>

                {/* 3 Featured Sample Theme Cards */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {LANDING_SAMPLE_THEMES.map((theme) => {
                        const demoUrl = `/demo/${theme.demoTier}/${theme.demoCode}`;
                        return (
                            <TiltCard key={theme.id} className="h-full">
                                <Card
                                    className="relative flex h-full flex-col items-start justify-between overflow-hidden bg-white p-6 text-left shadow-sm hover:shadow-md transition-shadow"
                                    hoverable={false}
                                >
                                    <div className="w-full">
                                        <div className="mb-6 flex items-center justify-between">
                                            <Badge variant={theme.accent}>
                                                {theme.tag}
                                            </Badge>
                                            <span className="font-poppins text-[10px] font-bold text-charcoal/40">
                                                MOBILE OPTIMIZED
                                            </span>
                                        </div>

                                        {/* Theme preview with floral bg */}
                                        <div
                                            className={`relative mb-6 flex aspect-[4/3] w-full select-none flex-col items-center justify-center overflow-hidden rounded-xl border p-4 ${theme.color}`}
                                        >
                                            <img
                                                src="/assets/wedding/hero-floral.png"
                                                alt=""
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
                                            />
                                            <img
                                                src="/assets/wedding/ornaments.png"
                                                alt=""
                                                aria-hidden="true"
                                                className="pointer-events-none absolute right-0 top-0 w-14 opacity-30"
                                            />
                                            <Smartphone
                                                className={`relative z-10 mb-2 h-8 w-8 opacity-50 ${theme.textColor}`}
                                            />
                                            <span
                                                className={`relative z-10 font-sans text-base font-semibold ${theme.textColor}`}
                                            >
                                                {theme.name}
                                            </span>
                                            <span
                                                className={`relative z-10 mt-1 text-[9px] uppercase tracking-widest opacity-40 ${theme.textColor}`}
                                            >
                                                Live Interactive
                                            </span>
                                        </div>

                                        <h3 className="mb-2 font-poppins text-lg font-bold text-charcoal">
                                            {theme.name}
                                        </h3>
                                        <p className="mb-6 font-sans text-sm leading-relaxed text-charcoal/60">
                                            {theme.description}
                                        </p>
                                    </div>

                                    <div className="w-full space-y-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTheme(theme)}
                                            className="shadow-xs inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gold-500 py-3 font-poppins text-sm font-semibold text-gold-600 transition-all duration-300 hover:bg-gold-500 hover:text-white hover:shadow-md"
                                        >
                                            <Eye size={16} />
                                            <span>Lihat Demo Interaktif</span>
                                        </button>
                                    </div>
                                </Card>
                            </TiltCard>
                        );
                    })}
                </div>

                {/* View Full Catalog CTA Banner */}
                <div className="mt-14 rounded-3xl border border-gold-200/60 bg-gradient-to-r from-cream/80 via-white to-cream/80 p-8 shadow-sm sm:p-10">
                    <div className="mx-auto flex flex-col items-center justify-between gap-6 md:flex-row md:text-left">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-gold-700">
                                <Sparkles size={13} className="text-gold-500" />
                                10+ Pilihan Desain Tersedia
                            </span>
                            <h3 className="mt-2 font-serif text-2xl font-bold text-charcoal sm:text-3xl">
                                Ingin Melihat Seluruh Koleksi Desain?
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-charcoal/70 sm:text-sm">
                                Jelajahi katalog lengkap kami dengan aneka konsep: Botanical Sage, Warm Terracotta,
                                Romantic Dusty Rose, Editorial Ivory Noir, Ocean Breeze, Olive Earth, Lavender Mist,
                                Golden Sunset, Royal Emerald, Sakura Blossom, hingga tema Premium &amp; Custom.
                            </p>
                        </div>
                        <Link
                            href="/katalog"
                            className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-charcoal px-8 py-4 font-poppins text-xs font-semibold tracking-wider uppercase text-white shadow-lg hover:bg-neutral-800 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            <span>Buka Katalog Lengkap</span>
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Demo Preview Modal */}
            <Modal
                isOpen={!!selectedTheme}
                onClose={() => setSelectedTheme(null)}
                title={`Pratinjau Tema: ${selectedTheme?.name || ''}`}
                size="lg"
            >
                {selectedTheme && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex w-full items-center justify-between border-b border-neutral-100 pb-3 text-xs">
                            <span className="font-mono text-charcoal/60">
                                /demo/{selectedTheme.demoTier}/{selectedTheme.demoCode}
                            </span>
                            <a
                                href={`/demo/${selectedTheme.demoTier}/${selectedTheme.demoCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-semibold text-gold-600 hover:text-gold-700"
                            >
                                <span>Buka Tab Penuh</span>
                                <ExternalLink size={13} />
                            </a>
                        </div>

                        {/* Interactive Phone Mockup Frame */}
                        <div className="relative mx-auto flex h-[580px] w-full max-w-[380px] flex-col overflow-hidden rounded-[36px] border-4 border-charcoal bg-white shadow-2xl">
                            <div className="absolute left-1/2 top-2 z-20 h-4 w-28 -translate-x-1/2 rounded-full bg-charcoal" />
                            <iframe
                                src={`/demo/${selectedTheme.demoTier}/${selectedTheme.demoCode}`}
                                title={selectedTheme.name}
                                className="h-full w-full border-0 pt-6"
                            />
                        </div>

                        <div className="mt-6 flex w-full items-center justify-between border-t border-neutral-100 pt-4">
                            <button
                                type="button"
                                onClick={() => setSelectedTheme(null)}
                                className="rounded-xl border border-neutral-200 px-5 py-2.5 text-xs font-semibold text-charcoal/70 hover:bg-neutral-50"
                            >
                                Tutup
                            </button>
                            <Link
                                href={`/register?theme=${selectedTheme.id}`}
                                className="flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal hover:bg-gold-400"
                            >
                                <span>Gunakan Tema Ini</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default Catalog;
