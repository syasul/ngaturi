import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Check,
    Copy,
    ExternalLink,
    Eye,
    Filter,
    Heart,
    Search,
    Smartphone,
    Sparkles,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import TiltCard from '../../components/ui/TiltCard';
import { ALL_THEMES, type CatalogTheme } from '../../data/themesData';
import Footer from '../../sections/landing/Footer';
import Navbar from '../../sections/landing/Navbar';

export const CatalogPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'premium' | 'custom'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredThemes = useMemo(() => {
        return ALL_THEMES.filter((theme) => {
            const matchesCategory =
                selectedCategory === 'all' || theme.category === selectedCategory;
            const matchesQuery =
                !searchQuery.trim() ||
                theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                theme.features.some((f) =>
                    f.toLowerCase().includes(searchQuery.toLowerCase()),
                );
            return matchesCategory && matchesQuery;
        });
    }, [selectedCategory, searchQuery]);

    const categories = [
        { id: 'all', label: 'Semua Tema', count: ALL_THEMES.length },
        {
            id: 'basic',
            label: 'Basic',
            count: ALL_THEMES.filter((t) => t.category === 'basic').length,
        },
        {
            id: 'premium',
            label: 'Premium',
            count: ALL_THEMES.filter((t) => t.category === 'premium').length,
        },
        {
            id: 'custom',
            label: 'Custom Exclusive',
            count: ALL_THEMES.filter((t) => t.category === 'custom').length,
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#FAF9F5] font-sans text-charcoal">
            <Head title="Katalog Tema Undangan Digital • Ngaturi" />
            <Navbar />

            <main className="pt-24 sm:pt-28">
                {/* Hero Header */}
                <section className="relative overflow-hidden bg-gradient-to-b from-cream/40 via-white to-transparent py-16 text-center sm:py-20">
                    <img
                        src="/assets/wedding/hero-floral.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.04]"
                    />

                    <div className="relative z-10 mx-auto max-w-4xl px-6">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-50/60 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-gold-700">
                            <Sparkles size={13} className="text-gold-500" />
                            Koleksi Desain Terlengkap
                        </span>

                        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-charcoal sm:text-5xl md:text-6xl">
                            Pilih Tema Undangan Pernikahan Anda
                        </h1>

                        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70 sm:text-base">
                            Jelajahi seluruh koleksi template undangan digital eksklusif dari Ngaturi.
                            Setiap desain dilengkapi scrollspy responsif, musik otomatis, countdown live,
                            serta fitur RSVP &amp; amplop digital interaktif.
                        </p>

                        {/* Search & Filter Bar */}
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <div className="relative w-full max-w-md">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari tema (misal: Sage, Terracotta, Ivory, Burgundy)..."
                                    className="w-full rounded-full border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-sm text-charcoal shadow-xs placeholder:text-charcoal/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-charcoal/40 hover:text-charcoal"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.id as any)}
                                    className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
                                        selectedCategory === cat.id
                                            ? 'bg-charcoal text-white shadow-md'
                                            : 'border border-neutral-200 bg-white text-charcoal/70 hover:border-gold-400 hover:text-charcoal'
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                            selectedCategory === cat.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-neutral-100 text-charcoal/60'
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Themes Grid */}
                <section className="relative mx-auto max-w-7xl px-6 pb-24">
                    {filteredThemes.length === 0 ? (
                        <div className="mx-auto max-w-md py-16 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-charcoal/40">
                                <Search size={24} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal">
                                Tema Tidak Ditemukan
                            </h3>
                            <p className="mt-2 text-xs text-charcoal/60">
                                Tidak ada tema yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                                Coba kata kunci lain atau pilih kategori &ldquo;Semua Tema&rdquo;.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="mt-5 rounded-full bg-gold-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-gold-600"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredThemes.map((theme) => {
                                const demoUrl = `/demo/${theme.demoTier}/${theme.demoCode}`;
                                return (
                                    <TiltCard key={theme.id} className="h-full">
                                        <Card
                                            className="relative flex h-full flex-col justify-between overflow-hidden bg-white p-6 text-left shadow-sm hover:shadow-md"
                                            hoverable={false}
                                        >
                                            <div>
                                                {/* Header Badges */}
                                                <div className="mb-4 flex items-center justify-between">
                                                    <Badge variant={theme.accent}>
                                                        {theme.tag}
                                                    </Badge>
                                                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal/40">
                                                        Code: {theme.demoCode}
                                                    </span>
                                                </div>

                                                {/* Theme Visual Mockup Header */}
                                                <div
                                                    className={`relative mb-5 flex aspect-[16/10] w-full select-none flex-col items-center justify-center overflow-hidden rounded-xl border p-4 shadow-inner ${theme.color}`}
                                                >
                                                    <img
                                                        src="/assets/wedding/hero-floral.png"
                                                        alt=""
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
                                                    />
                                                    <Smartphone
                                                        className={`relative z-10 mb-2 h-7 w-7 opacity-60 ${theme.textColor}`}
                                                    />
                                                    <span
                                                        className={`relative z-10 font-serif text-lg font-bold tracking-tight ${theme.textColor}`}
                                                    >
                                                        {theme.name}
                                                    </span>
                                                    <span
                                                        className={`relative z-10 mt-0.5 text-[9px] uppercase tracking-widest opacity-60 ${theme.textColor}`}
                                                    >
                                                        Live Interactive Theme
                                                    </span>
                                                </div>

                                                {/* Title & Description */}
                                                <h3 className="font-serif text-xl font-bold text-charcoal">
                                                    {theme.name}
                                                </h3>
                                                <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
                                                    {theme.description}
                                                </p>

                                                {/* Feature Badges */}
                                                <div className="mt-4 flex flex-wrap gap-1.5">
                                                    {theme.features.map((feat, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-charcoal/70"
                                                        >
                                                            &bull; {feat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-6 flex flex-col gap-2 pt-2 border-t border-neutral-100">
                                                <a
                                                    href={demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gold-500/40 bg-white py-2.5 text-xs font-semibold text-gold-700 shadow-2xs hover:bg-gold-500 hover:text-white transition-all"
                                                >
                                                    <Eye size={13} />
                                                    <span>Lihat Demo (Tab Baru)</span>
                                                    <ExternalLink size={12} />
                                                </a>

                                                <Link
                                                    href={`/register?theme=${theme.id}`}
                                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-charcoal py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
                                                >
                                                    <span>Gunakan Tema Ini</span>
                                                    <ArrowRight size={13} />
                                                </Link>
                                            </div>
                                        </Card>
                                    </TiltCard>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom CTA Banner */}
                    <div className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-charcoal via-[#1C1D21] to-charcoal p-8 text-center text-white shadow-xl sm:p-12">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-400">
                            Kemudahan Tanpa Batas
                        </span>
                        <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl md:text-4xl text-[#FAF7EE]">
                            Siap Membuat Undangan Impian Anda?
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-neutral-300 sm:text-sm">
                            Daftar akun gratis sekarang dan nikmati kemudahan kustomisasi nama mempelai,
                            lokasi acara, galeri foto, hingga kelola tamu &amp; RSVP real-time.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-charcoal shadow-lg hover:bg-gold-400 transition-all hover:scale-105 active:scale-95"
                            >
                                <span>Mulai Buat Undangan Sekarang</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/#pricing"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <span>Lihat Paket Harga</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CatalogPage;
